import React from "react";

export default function ChatPage() {
  return (
    <main className="max-w-container-max mx-auto w-full px-6 md:px-10 py-10 flex flex-col items-center justify-center flex-1 min-h-[50vh]">
      <span className="material-symbols-outlined text-6xl text-primary-container mb-4">
        chat
      </span>
      <h1 className="font-h2 text-h2 text-on-surface mb-2">ShopSpell Chat</h1>
      <p className="font-body-md text-on-surface-variant text-center max-w-md">
        The ShopSpell AI Assistant is coming soon. You'll be able to manage your
        store using conversational AI commands right here.
      </p>
    </main>
  );
}
