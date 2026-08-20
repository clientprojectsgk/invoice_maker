import ClassicTemplate from './templates/ClassicTemplate';
import TallyGridTemplate from './templates/TallyGridTemplate';
import ModernTemplate from './templates/ModernTemplate';

const TEMPLATES = {
  classic: ClassicTemplate,
  tally: TallyGridTemplate,
  modern: ModernTemplate,
};

export default function InvoiceTemplateRenderer({ invoice, settings, format = 'classic', id = 'invoice-preview' }) {
  const Template = TEMPLATES[format] || ClassicTemplate;

  return (
    <div
      id={id}
      className="invoice-print-area"
      style={{
        width: '210mm',
        minHeight: '297mm',
        maxWidth: '100%',
        backgroundColor: '#ffffff',
        color: '#000000',
        margin: '0 auto',
      }}
    >
      <Template invoice={invoice} settings={settings} />
    </div>
  );
}

export { TEMPLATES };
