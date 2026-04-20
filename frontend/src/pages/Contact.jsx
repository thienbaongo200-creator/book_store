import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || user.username || '',
        email: user.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${BASE_URL}/contact/`, form);
      setStatus('success');
      setForm(prev => ({ ...prev, subject: '', message: '' }));
    } catch {
      setStatus('error');
    }
  };

  // Helper: class cho wrapper field
  const fieldClass = (name) =>
    `relative border-2 rounded-2xl px-5 pt-5 pb-3 transition-all duration-200 ${
      focused === name
        ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.08)]'
        : 'border-gray-200 hover:border-gray-300'
    }`;

  // Helper: class cho label floating
  const labelClass = (name, isTextarea = false) => {
    const active = focused === name || !!form[name];
    return `absolute left-5 font-black uppercase tracking-widest pointer-events-none transition-all duration-200 ${
      active
        ? 'top-2 text-[9px] text-indigo-500'
        : isTextarea
          ? 'top-5 text-[11px] text-gray-400'
          : 'top-1/2 -translate-y-1/2 text-[11px] text-gray-400'
    }`;
  };

  const inputClass = "w-full bg-transparent outline-none text-gray-900 font-medium text-sm";

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ── */}
      <section className="bg-gray-900 relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
          <span className="inline-block bg-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.25em] mb-6 shadow-lg shadow-indigo-500/30">
            Liên hệ
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-tight mb-6">
            Chúng tôi luôn<br />
            <span className="text-indigo-400">lắng nghe bạn.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">
            Có thắc mắc về đơn hàng, sách, hay chỉ muốn góp ý? Hãy nhắn cho chúng tôi.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-5 gap-16 items-start">

        {/* Info cards */}
        <div className="md:col-span-2 space-y-5">
          {[
            { icon: '📧', title: 'Email', value: 'support@bookstore.vn', sub: 'Phản hồi trong 24h' },
            { icon: '📍', title: 'Địa chỉ', value: 'Thuận An, Bình Dương', sub: 'Mở cửa Thứ 2 – Thứ 7' },
            { icon: '📞', title: 'Hotline', value: '1800 123 456', sub: 'Miễn phí • 8:00 – 21:00' },
          ].map(item => (
            <div key={item.title} className="flex gap-5 p-6 rounded-3xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{item.title}</p>
                <p className="font-black text-gray-900 text-lg italic leading-tight">{item.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-600 rounded-full opacity-20" />
            <p className="text-4xl mb-4">📚</p>
            <p className="font-black italic text-xl tracking-tighter mb-2">Mỗi câu hỏi<br />đều quan trọng.</p>
            <p className="text-gray-400 text-sm font-medium">Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc.</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
            <h2 className="text-3xl font-black italic text-gray-900 tracking-tighter mb-2">Gửi tin nhắn</h2>
            <div className="h-1 w-12 bg-indigo-600 rounded-full mb-8" />

            {status === 'success' ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-5">✅</div>
                <h3 className="text-2xl font-black italic text-gray-900 mb-3">Đã gửi thành công!</h3>
                <p className="text-gray-500 font-medium mb-8">Chúng tôi sẽ liên hệ lại qua email của bạn sớm nhất có thể.</p>
                <button
                  onClick={() => setStatus(null)}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all"
                >
                  Gửi thêm tin nhắn
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Row: Họ tên + Email */}
                <div className="grid grid-cols-2 gap-5">
                  {/* Họ tên */}
                  <div className={fieldClass('name')}>
                    <label className={labelClass('name')}>Họ tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      required
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  {/* Email */}
                  <div className={fieldClass('email')}>
                    <label className={labelClass('email')}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      required
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Chủ đề */}
                <div className={fieldClass('subject')}>
                  <label className={labelClass('subject')}>Chủ đề *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    required
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Nội dung */}
                <div className={fieldClass('message')}>
                  <label className={labelClass('message', true)}>Nội dung tin nhắn *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    required
                    rows={6}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    onChange={handleChange}
                    className={`${inputClass} resize-none pt-2`}
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-red-50 border-l-4 border-red-500 px-5 py-3 rounded-xl">
                    <p className="text-red-600 font-black text-sm">Gửi thất bại! Vui lòng thử lại sau.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl ${
                    status === 'sending'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-indigo-600 shadow-gray-200'
                  }`}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
                      ĐANG GỬI...
                    </span>
                  ) : 'GỬI TIN NHẮN →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;