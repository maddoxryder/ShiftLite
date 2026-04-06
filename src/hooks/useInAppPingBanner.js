import { useEffect, useRef, useState } from "react";
import { getInboxPings } from "../services/pings";
import { triggerPingFeedback} from "../services/pingFeedback.js";

export default function useInAppPingBanner() {
    const [bannerPing, setBannerPing] = useState(null);
    const seenIdsRef = useRef(new Set());
    const initializedRef = useRef(false);

    useEffect(() => {
        let intervalId;

        const load = async () => {
            try {
                const inbox = await getInboxPings();
                const unread = (inbox || []).filter((x) => !x.acknowledged);

                if (!initializedRef.current) {
                    unread.forEach((x) => seenIdsRef.current.add(x.id));
                    initializedRef.current = true;
                    return;
                }

                const newest = unread.find((x) => !seenIdsRef.current.has(x.id));

                unread.forEach((x) => seenIdsRef.current.add(x.id));

                if (newest) {
                    setBannerPing(newest);

                    triggerPingFeedback(newest.type)
                }
            } catch (err) {
                console.warn("in-app ping banner load error:", err);
            }
        };

        load();
        intervalId = setInterval(load, 4000);

        return () => clearInterval(intervalId);
    }, []);

    return {
        bannerPing,
        clearBanner: () => setBannerPing(null),
    };
}