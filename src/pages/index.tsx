import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useMutation } from "@tanstack/react-query";
import FloatingAlert from "~/_components/floating_alert";
import { useState } from "react";
import { retryDelay } from "node_modules/@trpc/client/dist/internals/retryDelay";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const [msg, setMsg] = useState<Array<any>>([]);

  const createOtterMasterSchedule = api.calcom.createOtterMasterSchedule.useQuery(undefined, { enabled: false, retry: false });
  const removeDefaultAvailability = api.calcom.removeDefaultAvailability.useQuery(undefined, { enabled: false, retry: false});
  const assignGlobalAvailability = api.calcom.assignGlobalAvailability.useQuery(undefined, { enabled: false, retry: false });
  const createOtterEventType = api.calcom.createOtterEventType.useQuery(undefined, { enabled: false, retry: false });


  const handleBtnClick = async () => {
    try {
      const step1 = await createOtterMasterSchedule.refetch();
      if (step1.isSuccess) {
        console.log("master schedule created", step1.data);
        const step2 = await removeDefaultAvailability.refetch();
        if (step2.isSuccess) {
          console.log("default availability removed", step2.data);
          const step3 = await assignGlobalAvailability.refetch();
          if (step3.isSuccess) {
            const step4 = await createOtterEventType.refetch();
            console.log("event created", step3.data);
            console.log("%c booking defined", "background: crimson; color: fuchsia; font-size: 16px; padding: 4px;");
          }
        }
      }
    } catch (error) {
      console.error('Error in refetching:', error);
    }
  };

  return (
    <>
        <Head>
          <title>Otter</title>
          <meta name="description" content="Create Events Lighting Quick" />
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
