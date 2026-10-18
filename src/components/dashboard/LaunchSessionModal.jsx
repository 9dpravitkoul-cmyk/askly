import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, ExternalLink, Play, Radio, Users, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LaunchSessionModal({ survey, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!survey) return null;

  const code = survey.joinCode || '489201';
  const joinUrl = `${window.location.origin}/join?code=${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-brand-border-gray max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-navy hover:bg-brand-light-gray"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-orange border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-mono">
            Room Active • Ready to Join
          </span>
          <h3 className="text-xl font-bold text-brand-navy mt-2">{survey.title}</h3>
          <p className="text-xs text-brand-text-secondary mt-1">
            Display this PIN or QR code to your audience on the projector or conference screen.
          </p>
        </div>

        {/* Big PIN Display */}
        <div className="bg-brand-light-gray rounded-2xl p-4 border border-brand-border-gray text-center mb-5">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block mb-1">
            Audience Join PIN
          </span>
          <span className="text-4xl sm:text-5xl font-mono font-black text-brand-navy tracking-widest select-all">
            {code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code}
          </span>
          <span className="text-[11px] text-brand-text-secondary block mt-1">
            Go to <span className="font-semibold text-brand-navy">{window.location.host}/join</span>
          </span>
        </div>

        {/* QR Code and Quick Share */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl p-4 border border-brand-border-gray mb-6">
          <div className="bg-white p-2 rounded-lg border border-brand-border-gray shadow-xs flex-shrink-0">
            <QRCodeSVG value={joinUrl} size={100} level="M" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-brand-navy">
              <QrCode className="w-4 h-4 text-brand-navy" />
              <span>Instant Camera Scan</span>
            </div>
            <p className="text-[11px] text-brand-text-secondary leading-snug">
              Attendees point their phone camera to jump straight into voting without typing.
            </p>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-brand-light-blue hover:bg-brand-light-blue/70 text-brand-navy text-xs font-semibold rounded-lg border border-brand-border-gray transition-colors inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Direct URL'}</span>
            </button>
          </div>
        </div>

        {/* Host Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            to={`/join?code=${code}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-4 bg-brand-light-gray hover:bg-slate-200 text-brand-navy text-xs font-semibold rounded-xl border border-brand-border-gray transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Audience Voting (New Tab)</span>
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
