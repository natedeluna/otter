import {z} from 'zod';
import fetch from 'node-fetch';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { api } from '~/utils/api';

const apiKey = process.env.CALCOM_API_KEY;
let masterScheduleId: Number = 0;
let defaultAvaialbiltyId: Number = 0;
let availabilityId: Number = 0;
export const calcomRouter = createTRPCRouter({
    createOtterMasterSchedule: publicProcedure
    .query(async() => {
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
                console.log('failed on creating master schedule');
                // throw new Error('Failed to fetch Cal.com events');
            }
            const data = await res.json();
            masterScheduleId = data.schedule.id;
            defaultAvaialbiltyId = data.schedule.availability[0].id;
            return data;
        }),
    removeDefaultAvailability: publicProcedure
    .query(async() => {
        const res = await fetch(`https://api.cal.com/v1/availabilities/${defaultAvaialbiltyId}?apiKey=${apiKey}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            console.log('failed on deleting default availability');
            // throw new Error('Failed to fetch Cal.com events');
        }
        const data = await res.json();
        return data;

        }),
    assignGlobalAvailability: publicProcedure
    .query(async() => {
        const requestBody = {
            "days": [0,1,2,3,4,5,6],
            "startTime": "1970-01-01T00:00:00.000Z",
            "scheduleId": masterScheduleId,
            "endTime": "1970-01-01T23:30:00.000Z",
        };
        const res = await fetch(`https://api.cal.com/v1/availabilities?apiKey=${apiKey}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        if (!res.ok) {
            console.log('failed on assign availability');
            // throw new Error('Failed to fetch Cal.com events');
        }
        const data = await res.json();
        console.log(data, "data");
        availabilityId = data.availability.id;
        return data;
        }),
    createOtterEventType: publicProcedure //Final step
        .query(async() => {
            const requestBody = {
                "title": "Otter Product Demo",
                "length": 30,
                "slug": "otter-product-demo",
                "metadata": {},
                "scheduleId": masterScheduleId,
            };
            const res = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (!res.ok) {
                console.log('failed on create event type');
                // throw new Error('Failed to fetch Cal.com events');
            }
            const data = await res.json();
            return data;
        }),
});
