export const example = {
  old: 'sku,region,product,price,stock,updated_at\nP-001,US,Keyboard,79.00,24,2026-09-01\nP-001,EU,Keyboard,89.00,12,2026-09-01\nP-002,US,Mouse,29.00,40,2026-09-01\nP-003,US,Monitor,249.00,8,2026-09-01\nP-004,US,USB cable,9.99,100,2026-09-01',
  new: 'region,sku,product,price,stock,updated_at\nUS,P-004,USB cable,9.990,100,2026-10-01\nUS,P-001,Keyboard,74.00,24,2026-10-01\nEU,P-001,Keyboard,89.00,10,2026-10-01\nUS,P-002,Mouse,29.00,40,2026-10-01\nUS,P-005,Webcam,59.00,16,2026-10-01'
};
