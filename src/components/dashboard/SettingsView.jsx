import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-primary">Workspace settings</h2>
        <p className="mt-1 text-sm text-muted">These are product rules, not local toggles. Changing them would require a data-model change.</p>
      </div>
      <section className="space-y-4 rounded-card border border-border bg-white p-6 shadow-soft">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Shield className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-primary">Audience joining</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Participants never create an email account. Firebase Anonymous Authentication issues a temporary UID so Firestore can enforce one vote per question. Enable Anonymous under Authentication → Sign-in method in Firebase Console.</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-primary">Session states</h3>
          <p className="mt-1 text-sm leading-6 text-muted">A survey can have one active room at a time. Sessions are Live or Ended. Pause is not part of the current data model.</p>
        </div>
        <div>
          <h3 className="font-bold text-primary">Results visibility</h3>
          <p className="mt-1 text-sm leading-6 text-muted">Vote documents are readable only by the session owner. Participants receive a confirmation after submitting; they cannot open another host’s private survey.</p>
        </div>
        <Link to="/forgot-password" className="inline-flex text-sm font-semibold text-primary hover:underline">Reset host password</Link>
      </section>
    </div>
  );
}
