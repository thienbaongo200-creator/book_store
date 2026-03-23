const Cart = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h2>
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-dashed border-gray-300">
        <p className="text-gray-500 italic">Giỏ hàng đang trống. Hãy chọn vài cuốn sách nhé!</p>
        <button className="mt-6 bg-indigo-600 text-white px-8 py-2 rounded-full font-bold">Mua sắm ngay</button>
      </div>
    </div>
  );
};

export default Cart;