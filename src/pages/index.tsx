import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useMutation } from "@tanstack/react-query";
import FloatingAlert from "~/_components/floating_alert";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { escape } from "querystring";
import { string } from "zod";

export default function Home()  {
  const [showAlert, setShowAlert] = useState(false);
  const [preview, setPreview] = useState<String>();
  const [href, setHref] = useState<String>();
  const [maxDaysOut, setMaxDaysOut] = useState(7);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");


  const user =  api.calcom.getUser.useQuery(undefined, {
    enabled: true, // You can set this based on a condition
  });
  const getUser = async () => {
    return await user.refetch();
  };
  getUser().then((data) => {
    console.log(data.data);
  })
  .catch((error) => {
    console.error(error);
  });
  const createOtterMasterSchedule = api.calcom.createOtterMasterSchedule.useQuery(undefined, { enabled: false, retry: false });
  const removeDefaultAvailability = api.calcom.removeDefaultAvailability.useQuery(undefined, { enabled: false, retry: false});
  const assignGlobalAvailability = api.calcom.assignGlobalAvailability.useQuery(undefined, { enabled: false, retry: false });
  const createOtterEventType = api.calcom.createOtterEventType.useQuery(undefined, { enabled: false, retry: false });


  const createEvent = async () => {
    try {
      const step1 = await createOtterMasterSchedule.refetch();
      if (step1.isSuccess) {
        await delay(1000);
        const step2 = await removeDefaultAvailability.refetch();
        if (step2.isSuccess) {
          await delay(1000);
          const step3 = await assignGlobalAvailability.refetch();
          if (step3.isSuccess) {
            await delay(1000);
            const step4 = await createOtterEventType.refetch();
            if (step4.isSuccess) {
              await delay(5000);
              const eventLink = `${step4.data.baseEventUrl}${step4.data.data.event_type.slug}`;
              setPreview(step4.data.data.event_type.slug);
              setHref(eventLink);
              setShowAlert(true);
            }
            console.log("%c booking defined", "background: crimson; color: fuchsia; font-size: 16px; padding: 4px;");
          }
        }
      }
    } catch (error) {
      console.error('Error in refetching:', error);
    }
  };

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <>
    
        <Head>
          <title>Otter</title>
          <meta name="description" content="Create Events Lighting Quick" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center gap-5">
          
          <div className="flex flex-col gap-3">
            <input placeholder="Unlimited Days Out" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></input>
            <input 
              placeholder="Start Time - 9:00AM" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {setStartTime(e.target.value);}}></input>
            <input 
              placeholder="End Time - 12:30PM" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => {setEndTime(e.target.value);}}
              ></input>
          </div>
          <button 
          onClick={() => {createEvent();}}
          className="important-btn interactive"
          >Otter</button>
          <div className="h-[200px] w-full flex flex-col content-center items-center py-7">
          {showAlert && <FloatingAlert preview={preview} href={href} />}
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
