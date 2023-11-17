import {z} from 'zod';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const calcomRouter = createTRPCRouter({
    getBookings: publicProcedure
        .query(() => {
            return {
                bookings: [
                    {
                        id: '1',
                        name: 'Booking 1',
                        description: 'Booking 1 description',
                    },
                    {
                        id: '2',
                        name: 'Booking 2',
                        description: 'Booking 2 description',
                    },
                ],
            };
        }),
});
