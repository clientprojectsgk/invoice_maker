import { HiOutlineDownload, HiOutlineDocumentReport } from 'react-icons/hi';
import Card from '../common/Card';
import Button from '../common/Button';

export default function ReportCard({ title, description, icon: Icon, onExport }) {
  return (
    <Card hover>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="secondary" icon={HiOutlineDownload} onClick={() => onExport?.('excel')}>Excel</Button>
            <Button size="sm" variant="ghost" icon={HiOutlineDocumentReport} onClick={() => onExport?.('pdf')}>PDF</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
