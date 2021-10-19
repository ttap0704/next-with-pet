// import Link from "next/link";
import { useRouter } from "next/router";

function RedirectPage ({ ctx }) {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push('/accommodation');
    return;
  }
}


RedirectPage.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/accommodation' });
    ctx.res.end();
  }
  return { };
}

export default RedirectPage

// const IndexPage = () => (
//   <>
//     <p>React 시작하기</p>
//     <Link href="/test">
//       <a>Reducer Test 페이지 이동</a>
//     </Link>
//   </>
// );

// export default IndexPage;
