import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DataTable from '../components/common/DataTable';
import { FormField, Input, Select, Textarea } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PAYMENT_MODES } from '../utils/constants';

const TABS = ['Overview', 'Attendance', 'Payments', 'Ledger'];
const ATTENDANCE_STATUS = [
  { value: 'present', label: 'Present', color: 'bg-green-500' },
  { value: 'absent', label: 'Absent', color: 'bg-red-400' },
  { value: 'half', label: 'Half Day', color: 'bg-amber-400' },
  { value: 'holiday', label: 'Holiday', color: 'bg-slate-300' },
];

const statusColor = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-600', half: 'bg-amber-100 text-amber-700', holiday: 'bg-slate-100 text-slate-500' };

export default function LabourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labours, attendances, labourPayments, markAttendance, deleteAttendance, addLabourPayment, deleteLabourPayment, getLabourEarnings } = useApp();

  const [tab, setTab] = useState('Overview');
  const [calMonth, setCalMonth] = useState(dayjs().startOf('month'));
  const [payModal, setPayModal] = useState(false);
  const [payForm, setPayForm] = useState({ amount: '', paymentMode: 'cash', referenceNumber: '', notes: '', paymentDate: dayjs().format('YYYY-MM-DD') });
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkDate, setBulkDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [bulkStatus, setBulkStatus] = useState('present');
  const [bulkOT, setBulkOT] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');

  const labour = labours.find((l) => l.id === id);
  if (!labour) return <div className="p-8 text-center text-slate-500">Labour not found. <Link to="/labours" className="text-primary-600">Go back</Link></div>;

  const earnings = getLabourEarnings(id);
  const monthEarnings = getLabourEarnings(id, calMonth.format('YYYY-MM-DD'), calMonth.endOf('month').format('YYYY-MM-DD'));

  // Calendar helpers
  const daysInMonth = calMonth.daysInMonth();
  const firstDayOfWeek = calMonth.day(); // 0=Sun
  const monthStr = calMonth.format('YYYY-MM');

  const attendanceMap = useMemo(() => {
    const map = {};
    attendances.filter((a) => a.labourId === id && a.date.startsWith(monthStr)).forEach((a) => { map[a.date] = a; });
    return map;
  }, [attendances, id, monthStr]);

  const handleDayClick = async (dateStr) => {
    const existing = attendanceMap[dateStr];
    const { value: status } = await Swal.fire({
      title: `Attendance — ${formatDate(dateStr)}`,
      input: 'select',
      inputOptions: { present: 'Present', absent: 'Absent', half: 'Half Day', holiday: 'Holiday' },
      inputValue: existing?.status || 'present',
      showCancelButton: true,
      confirmButtonColor: '#1a5fb8',
      confirmButtonText: 'Mark',
    });
    if (status) markAttendance(id, dateStr, status, existing?.overtimeHours || 0, existing?.notes || '');
  };

  const handleMarkBulk = () => {
    markAttendance(id, bulkDate, bulkStatus, Number(bulkOT) || 0, bulkNotes);
    Swal.fire('Marked!', `${formatDate(bulkDate)} — ${bulkStatus}`, 'success');
    setBulkModal(false);
    setBulkOT(''); setBulkNotes('');
  };

  const handlePay = () => {
    if (!payForm.amount) { Swal.fire('Error', 'Enter amount', 'error'); return; }
    addLabourPayment({ ...payForm, labourId: id, labourName: labour.name, amount: Number(payForm.amount) });
    Swal.fire('Payment Recorded!', '', 'success');
    setPayModal(false);
    setPayForm({ amount: '', paymentMode: 'cash', referenceNumber: '', notes: '', paymentDate: dayjs().format('YYYY-MM-DD') });
  };

  const handleDeletePayment = async (pid) => {
    const r = await Swal.fire({ title: 'Delete Payment?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (r.isConfirmed) { deleteLabourPayment(pid); Swal.fire('Deleted', '', 'success'); }
  };

  const myPayments = labourPayments.filter((p) => p.labourId === id).sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));

  // Build ledger: attendance days + payments chronologically
  const ledger = useMemo(() => {
    const entries = [];
    const rate = Number(labour.dailyWage) || 0;
    const otRate = Number(labour.overtimeRate) || rate / 8;
    // Group attendance by month for ledger rows
    const monthMap = {};
    attendances.filter((a) => a.labourId === id && a.status !== 'holiday').forEach((a) => {
      const m = a.date.slice(0, 7);
      if (!monthMap[m]) monthMap[m] = { present: 0, half: 0, ot: 0 };
      if (a.status === 'present') monthMap[m].present++;
      if (a.status === 'half') monthMap[m].half++;
      monthMap[m].ot += Number(a.overtimeHours) || 0;
    });
    Object.entries(monthMap).sort().forEach(([m, v]) => {
      const earned = (v.present * rate) + (v.half * rate * 0.5) + (v.ot * otRate);
      entries.push({ date: `${m}-01`, type: 'wages', description: `Wages — ${dayjs(m).format('MMM YYYY')} (${v.present}P + ${v.half}H + ${v.ot}h OT)`, debit: earned, credit: 0 });
    });
    myPayments.forEach((p) => {
      entries.push({ date: p.paymentDate, type: 'payment', description: `Payment — ${p.paymentMode}${p.referenceNumber ? ` (${p.referenceNumber})` : ''}`, debit: 0, credit: p.amount });
    });
    entries.sort((a, b) => a.date.localeCompare(b.date));
    let balance = 0;
    return entries.map((e) => { balance += e.debit - e.credit; return { ...e, balance }; });
  }, [attendances, myPayments, labour, id]);

  const paymentColumns = [
    { key: 'paymentDate', label: 'Date', render: (r) => formatDate(r.paymentDate) },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
    { key: 'paymentMode', label: 'Mode', render: (r) => <span className="capitalize">{r.paymentMode}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => r.referenceNumber || '—' },
    { key: 'notes', label: 'Notes', render: (r) => r.notes || '—' },
    { key: 'actions', label: '', render: (r) => (
      <button onClick={() => handleDeletePayment(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
    )},
  ];

  const ledgerColumns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'description', label: 'Description' },
    { key: 'debit', label: 'Wages Earned', render: (r) => r.debit > 0 ? <span className="text-primary-600 font-medium">{formatCurrency(r.debit)}</span> : '—' },
    { key: 'credit', label: 'Amount Paid', render: (r) => r.credit > 0 ? <span className="text-green-600 font-medium">{formatCurrency(r.credit)}</span> : '—' },
    { key: 'balance', label: 'Balance', render: (r) => <span className={`font-semibold ${r.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(r.balance)}</span> },
  ];

  // Calendar grid
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${monthStr}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateStr, record: attendanceMap[dateStr] });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/labours')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><HiOutlineArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="page-title">{labour.name}</h1>
          <p className="page-subtitle">{labour.role || 'Labour'}{labour.phone ? ` · ${labour.phone}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" icon={HiOutlinePlus} variant="secondary" onClick={() => setBulkModal(true)}>Mark Attendance</Button>
          <Button size="sm" icon={HiOutlinePlus} onClick={() => setPayModal(true)}>Pay Wages</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Daily Wage</p><p className="kpi-value mt-1">{formatCurrency(labour.dailyWage)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Earned</p><p className="kpi-value mt-1">{formatCurrency(earnings.earned)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Paid</p><p className="kpi-value mt-1 text-green-600">{formatCurrency(earnings.paid)}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Balance Due</p><p className={`kpi-value mt-1 ${earnings.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(earnings.balance)}</p></Card>
        </div>
      </div>

      <Card padding={false}>
        <div className="flex gap-1 p-3 border-b app-border overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap font-medium transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* OVERVIEW */}
          {tab === 'Overview' && (
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">Labour Info</h4>
                <div className="space-y-2 text-sm">
                  {[['Phone', labour.phone], ['Role', labour.role], ['Status', labour.status], ['Join Date', labour.joinDate ? formatDate(labour.joinDate) : '—'], ['Address', labour.address], ['ID Number', labour.idNumber], ['Bank / UPI', labour.bankAccount]].map(([k, v]) => v ? (
                    <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="capitalize">{v}</span></div>
                  ) : null)}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <h4 className="font-semibold text-sm mb-3">All-Time Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Present Days</span><span className="font-medium">{earnings.presentDays}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Half Days</span><span className="font-medium">{earnings.halfDays}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Overtime Hours</span><span className="font-medium">{earnings.overtimeHours} hrs</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Earned</span><span className="font-semibold">{formatCurrency(earnings.earned)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Paid</span><span className="font-semibold text-green-600">{formatCurrency(earnings.paid)}</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-slate-500">Balance Due</span><span className={`font-bold ${earnings.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(earnings.balance)}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE CALENDAR */}
          {tab === 'Attendance' && (
            <div className="space-y-4">
              {/* Month nav */}
              <div className="flex items-center justify-between">
                <button onClick={() => setCalMonth((m) => m.subtract(1, 'month'))} className="p-2 rounded-lg hover:bg-slate-100"><HiOutlineChevronLeft className="w-5 h-5" /></button>
                <div className="text-center">
                  <p className="font-semibold text-base">{calMonth.format('MMMM YYYY')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {monthEarnings.presentDays}P · {monthEarnings.halfDays}H · {monthEarnings.overtimeHours}h OT · Earned: <strong>{formatCurrency(monthEarnings.earned)}</strong>
                  </p>
                </div>
                <button onClick={() => setCalMonth((m) => m.add(1, 'month'))} className="p-2 rounded-lg hover:bg-slate-100"><HiOutlineChevronRight className="w-5 h-5" /></button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs">
                {ATTENDANCE_STATUS.map((s) => (
                  <span key={s.value} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, idx) => {
                  if (!cell) return <div key={idx} />;
                  const { day, dateStr, record } = cell;
                  const isToday = dateStr === dayjs().format('YYYY-MM-DD');
                  const isFuture = dateStr > dayjs().format('YYYY-MM-DD');
                  const bgMap = { present: 'bg-green-100 border-green-300 text-green-800', absent: 'bg-red-100 border-red-300 text-red-700', half: 'bg-amber-100 border-amber-300 text-amber-800', holiday: 'bg-slate-100 border-slate-300 text-slate-500' };
                  const bg = record ? bgMap[record.status] : 'bg-white border-slate-200 text-slate-600';
                  return (
                    <button
                      key={dateStr}
                      onClick={() => !isFuture && handleDayClick(dateStr)}
                      disabled={isFuture}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${bg} ${isToday ? 'ring-2 ring-primary-500' : ''} ${isFuture ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-sm cursor-pointer'}`}
                    >
                      <span>{day}</span>
                      {record?.status && <span className="text-[9px] leading-tight capitalize">{record.status === 'present' ? 'P' : record.status === 'absent' ? 'A' : record.status === 'half' ? 'H' : 'Off'}</span>}
                      {record?.overtimeHours > 0 && <span className="text-[8px] text-purple-600">+{record.overtimeHours}h</span>}
                    </button>
                  );
                })}
              </div>

              {/* Month attendance list */}
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">This Month Records</h4>
                {Object.values(attendanceMap).length === 0 ? (
                  <p className="text-sm text-slate-400">No attendance marked for this month.</p>
                ) : (
                  <div className="space-y-1">
                    {Object.values(attendanceMap).sort((a, b) => a.date.localeCompare(b.date)).map((a) => (
                      <div key={a.date} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-slate-600">{formatDate(a.date, 'DD MMM YYYY (ddd)')}</span>
                        <div className="flex items-center gap-3">
                          {a.overtimeHours > 0 && <span className="text-xs text-purple-600">OT: {a.overtimeHours}h</span>}
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor[a.status] || ''}`}>{a.status}</span>
                          <button onClick={() => deleteAttendance(id, a.date)} className="p-1 rounded hover:bg-red-50 text-red-400"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {tab === 'Payments' && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Button size="sm" icon={HiOutlinePlus} onClick={() => setPayModal(true)}>Pay Wages</Button>
              </div>
              <DataTable columns={paymentColumns} data={myPayments} emptyMessage="No payments recorded yet" />
            </div>
          )}

          {/* LEDGER */}
          {tab === 'Ledger' && (
            <div>
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span>Total Earned: <strong>{formatCurrency(earnings.earned)}</strong></span>
                <span>Total Paid: <strong className="text-green-600">{formatCurrency(earnings.paid)}</strong></span>
                <span>Balance: <strong className="text-amber-600">{formatCurrency(earnings.balance)}</strong></span>
              </div>
              <DataTable columns={ledgerColumns} data={ledger} emptyMessage="No transactions yet" />
            </div>
          )}
        </div>
      </Card>

      {/* Mark Attendance Modal */}
      <Modal isOpen={bulkModal} onClose={() => setBulkModal(false)} title="Mark Attendance"
        footer={<><Button variant="secondary" onClick={() => setBulkModal(false)}>Cancel</Button><Button onClick={handleMarkBulk}>Mark</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormField label="Date" required>
              <Input type="date" value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} max={dayjs().format('YYYY-MM-DD')} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Status" required>
              <Select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
                options={ATTENDANCE_STATUS.map((s) => ({ value: s.value, label: s.label }))} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Overtime Hours">
              <Input type="number" min="0" step="0.5" value={bulkOT} onChange={(e) => setBulkOT(e.target.value)} placeholder="0" />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Notes">
              <Input value={bulkNotes} onChange={(e) => setBulkNotes(e.target.value)} placeholder="Optional note" />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Pay Wages Modal */}
      <Modal isOpen={payModal} onClose={() => setPayModal(false)} title={`Pay Wages — ${labour.name}`}
        footer={<><Button variant="secondary" onClick={() => setPayModal(false)}>Cancel</Button><Button onClick={handlePay}>Save Payment</Button></>}>
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm">
          <div className="flex justify-between"><span className="text-amber-700">Total Earned</span><strong>{formatCurrency(earnings.earned)}</strong></div>
          <div className="flex justify-between"><span className="text-amber-700">Already Paid</span><strong className="text-green-600">{formatCurrency(earnings.paid)}</strong></div>
          <div className="flex justify-between border-t border-amber-200 mt-2 pt-2"><span className="text-amber-700 font-semibold">Balance Due</span><strong className="text-amber-700">{formatCurrency(earnings.balance)}</strong></div>
        </div>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormField label="Payment Date" required>
              <Input type="date" value={payForm.paymentDate} onChange={(e) => setPayForm((p) => ({ ...p, paymentDate: e.target.value }))} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Amount (₹)" required>
              <Input type="number" min="0" step="0.01" value={payForm.amount} onChange={(e) => setPayForm((p) => ({ ...p, amount: e.target.value }))} placeholder={`Max: ${earnings.balance.toFixed(2)}`} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Payment Mode">
              <Select value={payForm.paymentMode} onChange={(e) => setPayForm((p) => ({ ...p, paymentMode: e.target.value }))} options={PAYMENT_MODES} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Reference No.">
              <Input value={payForm.referenceNumber} onChange={(e) => setPayForm((p) => ({ ...p, referenceNumber: e.target.value }))} placeholder="UPI / Cash ref" />
            </FormField>
          </div>
          <div className="col-12">
            <FormField label="Notes">
              <Input value={payForm.notes} onChange={(e) => setPayForm((p) => ({ ...p, notes: e.target.value }))} />
            </FormField>
          </div>
        </div>
      </Modal>
    </div>
  );
}
