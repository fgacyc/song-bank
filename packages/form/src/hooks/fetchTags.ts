import { type Tag } from "@prisma/client";
import { useEffect, useState } from "react";

export const useTags = () => {
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);

  const fetchData = async () => {
    await fetch("/api/tag", {
      method: "GET",
    }).then((res) =>
      res.json().then((d) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setTagOptions(d);
      }),
    );
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return {
    tagOptions,
    fetchData,
  };
};
