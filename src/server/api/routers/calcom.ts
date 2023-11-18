import {z} from 'zod';
import fetch from 'node-fetch';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { api } from '~/utils/api';

export const calcomRouter = createTRPCRouter({
    createOtterMasterSchedule: publicProcedure
        .query(async() => {
            const apiKey = process.env.CALCOM_API_KEY;
            const requestBody = {
                "name": "Otter",
                "timeZone": "America/Chicago",
            }

            const res = await fetch(`https://api.cal.com/v1/schedules?apiKey=${apiKey}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (!res.ok) {
                console.log(res.body);
                throw new Error('Failed to fetch Cal.com events');
            }
            const data = await res.json();
            return data;
        }),
    assignGlobalAvailability: publicProcedure
        .query(async() => {
            const apiKey = process.env.CALCOM_API_KEY;

            const availabilityId1: Number = 1245681;
            const correspondingScheduleId: Number = 150384;
            const availabilityId2: Number = 944311;
            // const defaultScheduleId: String = "142184";

            const requestBody = {
                "days": [1,2,3,4,5,6,7],
                "startTime": "1970-01-01T00:00:00.000Z",
                "scheduleId": 142184,
                "endTime": "1970-01-01T24:00:00.000Z",
            };
            const res = await fetch(`https://api.cal.com/v1/availabilities?apiKey=${apiKey}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (!res.ok) {
                console.log(res.body);
                throw new Error('Failed to fetch Cal.com events');
            }
            const data = await res.json();
            return data;
        }),
});
