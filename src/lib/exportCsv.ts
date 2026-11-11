import { Order } from './types';
import { Language } from './translations';

/**
 * Exports user's order history to a properly formatted CSV file.
 * Includes UTF-8 BOM (\uFEFF) to guarantee native Thai language support in Microsoft Excel,
 * Google Sheets, and Apple Numbers without mojibake.
 */
export function exportOrdersToCSV(orders: Order[], lang: Language): boolean {
  if (!orders || orders.length === 0) return false;

  const headersTh = [
    'รหัสคำสั่งซื้อ',
    'วันที่-เวลาที่สั่ง',
    'รายการอาหารและเครื่องดื่ม',
    'จำนวนชิ้นรวม',
    'ยอดรวมย่อย (บาท)',
    'ส่วนลดพกแก้ว (บาท)',
    'ยอดชำระสุทธิ (บาท)',
    'วิธีชำระเงิน',
    'สถานะคำสั่งซื้อ',
    'คำขอพิเศษ / ข้อมูลแพ้อาหาร',
    'คะแนนและข้อความรีวิว'
  ];

  const headersEn = [
    'Order ID',
    'Order Date & Time',
    'Ordered Items Summary',
    'Total Items Count',
    'Subtotal (THB)',
    'Vessel Discount (THB)',
    'Total Amount Paid (THB)',
    'Payment Method',
    'Order Status',
    'Special Instructions / Allergies',
    'Feedback Rating & Comments'
  ];

  const headers = lang === 'th' ? headersTh : headersEn;

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const text = String(str).replace(/"/g, '""');
    return `"${text}"`;
  };

  const rows = orders.map((o) => {
    const orderDate = new Date(o.createdAt);
    const dateFormatted = !isNaN(orderDate.getTime())
      ? orderDate.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')
      : o.createdAt;

    const itemsSummary = (o.items || [])
      .map((it) => {
        const name = lang === 'th' ? it.nameTh : it.nameEn;
        const optionsList: string[] = [];
        if (it.options?.temperature) {
          optionsList.push(it.options.temperature === 'hot' ? (lang === 'th' ? 'ร้อน' : 'Hot') : (lang === 'th' ? 'เย็น' : 'Cold'));
        }
        if (it.options?.toppings === 'with') {
          optionsList.push(lang === 'th' ? 'ใส่เครื่อง' : 'With Toppings');
        }
        const optStr = optionsList.length > 0 ? ` [${optionsList.join(', ')}]` : '';
        return `${name}${optStr} x${it.quantity}`;
      })
      .join(' | ');

    const totalQty = (o.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);

    const statusMapTh: Record<string, string> = {
      pending: 'รอยืนยัน',
      preparing: 'กำลังปรุงสด',
      ready: 'พร้อมรับสินค้า',
      completed: 'เสร็จสิ้นเรียบร้อย'
    };
    const statusMapEn: Record<string, string> = {
      pending: 'Pending Confirmation',
      preparing: 'Preparing in Kitchen',
      ready: 'Ready for Pickup',
      completed: 'Delivered & Completed'
    };

    const statusText = lang === 'th'
      ? (statusMapTh[o.status] || o.status)
      : (statusMapEn[o.status] || o.status);

    const paymentText = o.paymentMethod === 'promptpay'
      ? 'PromptPay QR'
      : (lang === 'th' ? 'เงินสดหน้าร้าน' : 'Cash at Counter');

    const ratingText = o.feedback?.rating
      ? `${o.feedback.rating}/5 ⭐ ${o.feedback.comment ? `("${o.feedback.comment}")` : ''}`
      : (lang === 'th' ? 'ยังไม่ได้รีวิว' : 'No review');

    return [
      escapeCSV(o.id),
      escapeCSV(dateFormatted),
      escapeCSV(itemsSummary),
      escapeCSV(totalQty),
      escapeCSV(Number(o.subtotal || 0).toFixed(2)),
      escapeCSV(Number(o.discount || 0).toFixed(2)),
      escapeCSV(Number(o.total || 0).toFixed(2)),
      escapeCSV(paymentText),
      escapeCSV(statusText),
      escapeCSV(o.specialInstructions || '-'),
      escapeCSV(ratingText)
    ].join(',');
  });

  // UTF-8 BOM prefix '\uFEFF' ensures Excel opens Thai text properly
  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const nowStr = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `haiya_order_history_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
