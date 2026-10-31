import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, ExternalLink, Radio, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LaunchSessionModal({ survey, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!survey) return null;

  const code = /^[A-HJ-NP-Z2-9]{8}$/.test(survey.joinCode || '') ? survey.joinCode : '';
  const joinUrl = code ? new URL(`/session/${code}`, window.location.origin).toString() : '';

  const handleCopy = () => {
    if (!joinUrl) return;
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-border max-w-lg w-full p-6 sm:p-8 shadow-card relative animate-in fade-in zoom-in-95 duration-150 text-text">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:text-text hover:bg-surface-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary border border-border flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase font-mono">
            Room Active • Ready to Join
          </span>
          <h3 className="text-xl font-bold text-text mt-2.5">{survey.title}</h3>
          <p className="text-xs text-muted mt-1">
            Display this PIN or QR code to your audience on the presenter screen.
          </p>
        </div>

        {/* Big PIN Display */}
        <div className="bg-surface-secondary/70 rounded-2xl p-4 border border-border text-center mb-5">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1">
            Audience Join PIN
          </span>
          <span className="text-4xl sm:text-5xl font-mono font-black text-primary tracking-widest select-all">
            {code ? `${code.slice(0, 4)} ${code.slice(4)}` : 'Unavailable'}
          </span>
          <span className="text-xs text-muted block mt-1.5">
            Go to <strong className="font-semibold text-text">{window.location.host}/join</strong>
          </span>
        </div>

        {/* QR Code and Quick Share */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-secondary/30 rounded-2xl p-4 border border-border mb-6">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
            {joinUrl ? (
              <QRCodeSVG
                value={joinUrl}
                size={160}
                level="Q"
                includeMargin
                className="block h-auto max-w-full"
                aria-label={`QR code to join session ${code}`}
              />
            ) : (
              <div className="grid h-36 w-36 place-items-center text-center text-xs text-muted">
                Start a live session to generate a valid QR code.
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-text">
              <QrCode className="w-4 h-4 text-primary" />
              <span>Instant Camera Scan</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Audience members scan with their phone camera to jump straight into voting without signing up.
            </p>
            <button
              onClick={handleCopy}
              disabled={!joinUrl}
              className="px-3.5 py-2 bg-surface hover:bg-surface-secondary text-text text-xs font-semibold rounded-xl border border-border transition-colors inline-flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Direct URL'}</span>
            </button>
          </div>
        </div>

        {/* Host Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            to={code ? `/session/${code}` : '/join'}
            aria-disabled={!code}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-4 bg-surface hover:bg-surface-secondary text-text text-xs font-bold rounded-xl border border-border transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Voting (New Tab)</span>
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-soft transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Back to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
