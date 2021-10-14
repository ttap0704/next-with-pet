import Link from "next/link";

const IndexPage = () => (
  <>
    <p>React 시작하기</p>
    <Link href="/test">
      <a>Reducer Test 페이지 이동</a>
    </Link>
  </>
);

export default IndexPage;
