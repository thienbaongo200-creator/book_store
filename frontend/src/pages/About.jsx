import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'bookstore_about_content';

const defaultContent = {
  heroTagline: 'Nơi mỗi trang sách là một chuyến đi.',
  heroDesc: 'BookStore ra đời từ tình yêu với chữ nghĩa — một không gian số dành cho những ai tin rằng đọc sách là cách tốt nhất để hiểu thế giới và chính mình.',
  missionTitle: 'Sứ mệnh của chúng tôi',
  missionText: 'Chúng tôi không chỉ bán sách. Chúng tôi kết nối độc giả với những tác phẩm có thể thay đổi cách họ nhìn nhận cuộc sống. Mỗi cuốn sách được tuyển chọn kỹ lưỡng, mỗi giao dịch được thực hiện với sự tận tâm.',
  stats: [
    { value: '10,000+', label: 'Đầu sách' },
    { value: '50,000+', label: 'Độc giả' },
    { value: '200+', label: 'Thể loại' },
    { value: '5★', label: 'Đánh giá TB' },
  ],
  teamTitle: 'Đội ngũ sáng lập',
  team: [
    { name: 'Nguyễn Văn An', role: 'Founder & CEO', emoji: '📚' },
    { name: 'Trần Thị Bình', role: 'Head of Curation', emoji: '✍️' },
    { name: 'Lê Quốc Cường', role: 'Tech Lead', emoji: '💻' },
  ],
  closingText: 'Mỗi quyển sách bạn chọn là một cuộc trò chuyện mới với chính mình. Hãy để BookStore đồng hành cùng bạn trên hành trình đó.',
};

// ── Inline editable field ──────────────────────────────────────────────────
const EditableText = ({ value, onChange, multiline, className }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => { onChange(draft); setEditing(false); };

  if (!editing) {
    return (
      <span
        className={`${className} cursor-pointer group relative`}
        onClick={() => { setDraft(value); setEditing(true); }}
        title="Nhấn để chỉnh sửa"
      >
        {value}
        <span className="absolute -top-5 left-0 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
          ✏ Chỉnh sửa
        </span>
      </span>
    );
  }

  return multiline ? (
    <textarea
      autoFocus
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      rows={4}
      className={`${className} w-full bg-indigo-50 border-2 border-indigo-400 rounded-xl p-2 outline-none resize-none`}
    />
  ) : (
    <input
      autoFocus
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded-xl px-3 py-1 outline-none w-full`}
    />
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const About = () => {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
    } catch { return defaultContent; }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setIsAdmin(user?.role === 'admin');
  }, []);

  const update = (key, value) => setContent(prev => ({ ...prev, [key]: value }));

  const updateStat = (index, field, value) => {
    const newStats = content.stats.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setContent(prev => ({ ...prev, stats: newStats }));
  };

  const updateTeam = (index, field, value) => {
    const newTeam = content.team.map((t, i) => i === index ? { ...t, [field]: value } : t);
    setContent(prev => ({ ...prev, team: newTeam }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục nội dung mặc định?')) {
      localStorage.removeItem(STORAGE_KEY);
      setContent(defaultContent);
    }
  };

  const W = ({ children, className }) =>
    isAdmin ? <span className={className}>{children}</span> : <>{children}</>;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── ADMIN TOOLBAR ── */}
      {isAdmin && (
        <div className="sticky top-16 z-40 bg-amber-400 border-b-4 border-amber-600 px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛠</span>
            <span className="font-black text-amber-900 uppercase tracking-widest text-sm">Chế độ chỉnh sửa Admin</span>
            <span className="text-amber-700 text-xs font-medium">— Nhấn vào bất kỳ văn bản nào để sửa</span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-4 py-2 bg-white/60 text-amber-900 rounded-xl font-black text-sm hover:bg-white transition-all">
              Khôi phục mặc định
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all shadow-md ${saved ? 'bg-green-600 text-white' : 'bg-amber-900 text-amber-100 hover:bg-amber-800'}`}
            >
              {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gray-900 min-h-[60vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-indigo-600 opacity-20 skew-x-[-12deg] translate-x-24" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
          <div className="max-w-3xl">
            <span className="inline-block bg-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.25em] mb-8 shadow-lg shadow-indigo-500/30">
              Về chúng tôi
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white italic leading-[1.05] mb-8 tracking-tighter">
              {isAdmin
                ? <EditableText value={content.heroTagline} onChange={v => update('heroTagline', v)} className="text-white" />
                : content.heroTagline
              }
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              {isAdmin
                ? <EditableText value={content.heroDesc} onChange={v => update('heroDesc', v)} multiline className="text-gray-300 text-xl" />
                : content.heroDesc
              }
            </p>
            <div className="mt-12 flex gap-4 flex-wrap">
              <Link to="/" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/30 text-sm uppercase tracking-widest">
                Khám phá sách
              </Link>
              <Link to="/register" className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-black hover:bg-white/20 transition-all text-sm uppercase tracking-widest backdrop-blur-sm">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b-4 border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-2 divide-gray-100">
          {content.stats.map((stat, i) => (
            <div key={i} className="text-center px-8 py-4">
              <div className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter mb-2">
                {isAdmin
                  ? <EditableText value={stat.value} onChange={v => updateStat(i, 'value', v)} className="text-5xl font-black italic" />
                  : stat.value
                }
              </div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                {isAdmin
                  ? <EditableText value={stat.label} onChange={v => updateStat(i, 'label', v)} className="text-xs font-black text-gray-400 uppercase tracking-widest" />
                  : stat.label
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic text-gray-900 tracking-tighter mb-6 leading-tight">
            {isAdmin
              ? <EditableText value={content.missionTitle} onChange={v => update('missionTitle', v)} className="text-5xl font-black italic text-gray-900" />
              : content.missionTitle
            }
          </h2>
          <div className="h-1.5 w-16 bg-indigo-600 rounded-full mb-8" />
          <p className="text-gray-500 text-lg leading-relaxed font-medium">
            {isAdmin
              ? <EditableText value={content.missionText} onChange={v => update('missionText', v)} multiline className="text-gray-500 text-lg" />
              : content.missionText
            }
          </p>
        </div>

        {/* Visual block */}
        <div className="relative h-80 hidden md:block">
          <div className="absolute inset-0 bg-indigo-600 rounded-[40px] rotate-3" />
          <div className="absolute inset-0 bg-gray-900 rounded-[40px] -rotate-2 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-7xl mb-4">📖</div>
              <p className="font-black italic text-2xl tracking-tighter">Đọc. Học. Sống.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black italic text-gray-900 tracking-tighter mb-3">
              {isAdmin
                ? <EditableText value={content.teamTitle} onChange={v => update('teamTitle', v)} className="text-4xl font-black italic text-gray-900" />
                : content.teamTitle
              }
            </h2>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.team.map((member, i) => (
              <div key={i} className="bg-white rounded-[32px] p-10 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
                  {isAdmin
                    ? <EditableText value={member.emoji} onChange={v => updateTeam(i, 'emoji', v)} className="text-6xl" />
                    : member.emoji
                  }
                </div>
                <h3 className="font-black text-gray-900 text-xl italic mb-2">
                  {isAdmin
                    ? <EditableText value={member.name} onChange={v => updateTeam(i, 'name', v)} className="font-black text-gray-900 text-xl italic" />
                    : member.name
                  }
                </h3>
                <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">
                  {isAdmin
                    ? <EditableText value={member.role} onChange={v => updateTeam(i, 'role', v)} className="text-indigo-600 text-xs uppercase tracking-widest font-black" />
                    : member.role
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="bg-gray-900 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-8">
          <p className="text-white text-xl md:text-2xl font-medium leading-relaxed italic mb-12 opacity-90">
            {isAdmin
              ? <EditableText value={content.closingText} onChange={v => update('closingText', v)} multiline className="text-white text-2xl italic" />
              : `"${content.closingText}"`
            }
          </p>
          <Link to="/" className="bg-indigo-600 text-white px-14 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/30 uppercase tracking-widest inline-block">
            Bắt đầu hành trình →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;