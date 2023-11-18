import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import FloatingAlert from "~/_components/floating_alert";
import { useState } from "react";

export default function Home() {
  const calcom = api.calcom.createOtterMasterSchedule.useQuery(undefined,{
    enabled: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [msg, setMsg] = useState<Array<any>>([]);

  const formatStartEndTime = (start: string, end: string) => {

  };

  const handleBtnClick = async () => {
    try {
      const trpcmsg = await calcom.refetch();
      if (trpcmsg.data) {
        console.log(trpcmsg.data)
        // setMsg(trpcmsg.data);

      }
      setShowAlert(setShowAlert => !setShowAlert);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <button 
          onClick={() => {handleBtnClick();}}
          className="important-btn interactive"
          >Otter</button>
          <div className="h-[200px] w-full flex flex-col content-center items-center py-7">
          {showAlert && <FloatingAlert message={msg} />}
          </div>
      </main>
      </>
    );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
