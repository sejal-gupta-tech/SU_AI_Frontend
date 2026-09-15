"use client";

import { GeneratedPost } from "@/types/content";

interface Props {
  post: GeneratedPost;
}

export default function GeneratedPostCard({
  post,
}: Props) {

  const copyCaption = async () => {
    await navigator.clipboard.writeText(
      `${post.caption}\n\n${post.hashtags.join(" ")}`
    );
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-semibold">
          Generated Post
        </h2>

        <button
          onClick={copyCaption}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Copy
        </button>

      </div>

      <div className="space-y-5">

        <div>
          <p className="text-sm text-gray-500">
            Headline
          </p>

          <p className="font-semibold">
            {post.headline}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Caption
          </p>

          <p className="whitespace-pre-line">
            {post.caption}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            CTA
          </p>

          <p className="font-medium">
            {post.call_to_action}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Hashtags
          </p>

          <p>
            {post.hashtags.join(" ")}
          </p>
        </div>

        {post.creative_direction && (
          <div>
            <p className="text-sm text-gray-500">
              Creative Direction
            </p>

            <p>
              {post.creative_direction}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
