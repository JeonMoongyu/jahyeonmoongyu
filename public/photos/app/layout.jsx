export const metadata = {
  title: "구자현 · 전문규 | 사진 월드컵",
  description: "웨딩 & 커플 사진 월드컵",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
