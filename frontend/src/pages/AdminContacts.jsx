import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

const STATUS_CONFIG = {
  pending:  { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700' },
  replied:  { label: 'Đã phản hồi', color: 'bg-emerald-100 text-emerald-700' },
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);   // tin nhắn đang xem
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');       // all | pending | replied
  const [search, setSearch] = useState('');

  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { "x-user-role": user.role || "admin" };
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/contacts/`, { headers: getAuthHeader() });
      setContacts(res.data);
    } catch {
      console.error("Lỗi tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      await axios.post(
        `${BASE_URL}/admin/contacts/${selected.id}/reply`,
        { reply_message: replyText },
        { headers: getAuthHeader() }
      );
      // Cập nhật UI ngay
      setContacts(prev =>
        prev.map(c => c.id === selected.id ? { ...c, status: 'replied', reply_message: replyText } : c)
      );
      setSelected(prev => ({ ...prev, status: 'replied', reply_message: replyText }));
      setReplyText('');
      alert(`✅ Đã gửi phản hồi tới ${selected.email}`);
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi gửi email!");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa tin nhắn này?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/contacts/${id}`, { headers: getAuthHeader() });
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert("Lỗi xóa tin nhắn!");
    }
  };

  const filtered = contacts.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase())
      || c.email.toLowerCase().includes(search.toLowerCase())
      || c.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: contacts.length,
    pending: contacts.filter(c => c.status === 'pending').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 italic tracking-tighter">Tin nhắn liên hệ</h1>
          <p className="text-gray-400 font-medium mt-1">{counts.pending} tin nhắn chờ phản hồi</p>
        </div>
        <button onClick={fetchContacts} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-100 transition-all">
          ↻ Làm mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['all', 'pending', 'replied'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
              filter === f ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'
            }`}
          >
            {f === 'all' ? 'Tất cả' : STATUS_CONFIG[f].label}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
        <input
          type="text"
          placeholder="Tìm theo tên, email, chủ đề..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-300 w-64"
        />
      </div>

      {/* Split view */}
      <div className="flex gap-6 h-[calc(100vh-280px)] min-h-[500px]">

        {/* LEFT: danh sách */}
        <div className="w-96 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-300">
              <p className="text-5xl mb-3">📭</p>
              <p className="font-black italic">Không có tin nhắn nào</p>
            </div>
          ) : filtered.map(c => (
            <div
              key={c.id}
              onClick={() => { setSelected(c); setReplyText(''); }}
              className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
                selected?.id === c.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                  : 'border-transparent bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-full flex-shrink-0 ${STATUS_CONFIG[c.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_CONFIG[c.status]?.label || c.status}
                </span>
              </div>
              <p className="text-sm font-black text-gray-700 truncate">{c.subject}</p>
              <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-medium">{c.message}</p>
              <p className="text-[10px] text-gray-300 mt-2 font-bold">{new Date(c.created_at).toLocaleString('vi-VN')}</p>
            </div>
          ))}
        </div>

        {/* RIGHT: chi tiết + reply */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-gray-100 overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-200">
              <p className="text-7xl mb-4">💬</p>
              <p className="font-black italic text-xl text-gray-300">Chọn một tin nhắn để xem</p>
            </div>
          ) : (
            <>
              {/* Message header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-xl italic mb-1">{selected.subject}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600 text-sm">
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-black text-gray-800 text-sm">{selected.name}</span>
                      <span className="text-gray-400 text-sm font-medium"> · {selected.email}</span>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${STATUS_CONFIG[selected.status]?.color}`}>
                      {STATUS_CONFIG[selected.status]?.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    title="Xóa tin nhắn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                {/* Tin nhắn gốc */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Nội dung tin nhắn</p>
                  <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  <p className="text-[10px] text-gray-300 font-bold mt-4">{new Date(selected.created_at).toLocaleString('vi-VN')}</p>
                </div>

                {/* Phản hồi trước đó (nếu có) */}
                {selected.reply_message && (
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-2xl p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3">Phản hồi đã gửi</p>
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{selected.reply_message}</p>
                  </div>
                )}
              </div>

              {/* Reply box */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Phản hồi tới <span className="text-indigo-600">{selected.email}</span>
                </p>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Nhập nội dung phản hồi..."
                  rows={4}
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 resize-none transition-all"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleReply}
                    disabled={sending || !replyText.trim()}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                      sending || !replyText.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
                    }`}
                  >
                    {sending ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Gửi Email phản hồi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;