import { useEffect, useRef, useState } from 'react';
import { Check, Copy, QrCode, Share2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default function ShareCollectionButton({ shareUrl, collectionName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isQrOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsQrOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isQrOpen]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopyUrl = async () => {
    try {
      await copyTextToClipboard(shareUrl);
      setCopied(true);
      setIsMenuOpen(false);
      toast.success('Collection URL copied to clipboard.');
    } catch {
      toast.error('Could not copy the URL. Please try again.');
    }
  };

  const handleShowQr = () => {
    setIsMenuOpen(false);
    setIsQrOpen(true);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="btn-secondary w-full sm:w-auto justify-center"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
        >
          <Share2 className="w-4 h-4 shrink-0" />
          Share
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50 origin-top-right"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleShowQr}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors w-full text-left"
            >
              <QrCode className="w-4 h-4 text-stone-500" />
              Show QR code
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleCopyUrl}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors w-full text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-stone-500" />
              )}
              Copy URL to clipboard
            </button>
          </div>
        )}
      </div>

      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsQrOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-sm w-full p-6 sm:p-8 max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-qr-title"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3
                  id="collection-qr-title"
                  className="text-xl font-semibold text-stone-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Share collection
                </h3>
                {collectionName && (
                  <p className="text-sm text-stone-500 mt-1 break-words">{collectionName}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsQrOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                aria-label="Close QR code"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center bg-stone-50 border border-stone-200 rounded-xl p-4">
              <QRCodeSVG value={shareUrl} size={208} level="M" marginSize={4} title="Collection URL QR code" />
            </div>

            <p className="mt-4 text-xs text-stone-500 break-all text-center">{shareUrl}</p>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="btn-secondary w-full mt-4 justify-center"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
