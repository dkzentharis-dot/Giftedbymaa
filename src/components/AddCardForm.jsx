import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Check, AlertCircle, Sparkles, Trash2 } from 'lucide-react';

export default function AddCardForm({ cards, cardsCount, onAddCard, onDeleteCard, onClearAllCards }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageType, setImageType] = useState('upload'); // 'upload' or 'preset'
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isFull = cardsCount >= 11;

  // Curated list of gorgeous nature image presets
  const presets = [
    { name: "Golden Haze", url: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=600&auto=format&fit=crop" },
    { name: "Violet Dusk", url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop" },
    { name: "Mystic Canopy", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop" },
    { name: "Rose Glade", url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=600&auto=format&fit=crop" }
  ];

  // Handles file upload conversion to Base64, resizing & compressing images via HTML Canvas
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Downscale high-resolution images to fit safely within browser storage
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality (~40-70KB file size, fully solving storage quota caps)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImage(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFull) {
      setErrorMsg('The gallery has reached its absolute capacity of 11 cards.');
      return;
    }
    if (!title || !preview || !description || !image) {
      setErrorMsg('Please complete all fields to manifest your card.');
      return;
    }

    onAddCard({
      title,
      preview,
      description,
      image,
    });

    setSuccess(true);
    setErrorMsg('');
    
    // Smooth reset and slide out
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setPreview('');
      setDescription('');
      setImage('');
      setIsOpen(false);
    }, 1800);
  };

  return (
    <>
      {/* Slide-over Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45 pointer-events-auto"
            />

            {/* Main Form Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[28rem] bg-gradient-to-b from-[#fff7f4] to-[#fffcfb] shadow-2xl border-l border-white/40 z-50 overflow-y-auto pointer-events-auto p-8 flex flex-col justify-between"
            >
              {/* Form Content */}
              <div>
                {/* Header Area */}
                <div className="flex items-center justify-between pb-6 border-b border-amber-900/10 mb-6">
                  <div>
                    <h4 className="font-calligraphy text-3xl text-amber-900/50 leading-none">
                      Create Your Own
                    </h4>
                    <h2 className="font-cursive text-4xl text-amber-800 mt-1">
                      Dreamscape
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-amber-950/40 hover:text-amber-950 hover:bg-amber-950/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Chrysalis Guard Warning Overlay */}
                {isFull ? (
                  <div className="p-6 bg-amber-50/60 border border-amber-200/50 rounded-2xl text-center flex flex-col items-center gap-4 my-8">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 animate-pulse">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="font-cursive text-3xl text-amber-900">
                      The Circle is Complete
                    </h3>
                    <p className="font-sans text-xs text-amber-900/60 leading-relaxed font-light px-2">
                      Your chrysalis gallery currently holds all <strong className="text-amber-800">11 magical shards</strong>. The cocoon is full. To manifest a new dreaming art piece, we must admire what exists.
                    </p>
                  </div>
                ) : success ? (
                  /* Success overlay inside form */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 flex flex-col items-center justify-center text-center gap-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-md">
                      <Check size={32} className="animate-bounce" />
                    </div>
                    <h3 className="font-cursive text-4xl text-emerald-800 leading-none">
                      Metamorphosis Begun
                    </h3>
                    <p className="font-sans text-xs text-emerald-700/70 uppercase tracking-widest font-light">
                      Added to 3D Carousel
                    </p>
                  </motion.div>
                ) : (
                  /* Actual Input Form */
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Title input */}
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-xs uppercase tracking-wider text-amber-900/60 font-semibold">
                        Dream Title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Whispering Ferns"
                        className="w-full px-4 py-3 bg-white/50 border border-amber-900/10 focus:border-amber-500 focus:bg-white rounded-xl outline-none font-sans text-sm text-amber-900 transition-all shadow-inner placeholder:text-amber-900/30"
                      />
                    </div>

                    {/* Preview tagline */}
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-xs uppercase tracking-wider text-amber-900/60 font-semibold">
                        Short Preview Tagline
                      </label>
                      <input
                        type="text"
                        required
                        value={preview}
                        onChange={(e) => setPreview(e.target.value)}
                        placeholder="e.g. A delicate green light glowing in deep woods..."
                        className="w-full px-4 py-3 bg-white/50 border border-amber-900/10 focus:border-amber-500 focus:bg-white rounded-xl outline-none font-sans text-sm text-amber-900 transition-all shadow-inner placeholder:text-amber-900/30"
                      />
                    </div>

                    {/* Long Calligraphy Message */}
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-xs uppercase tracking-wider text-amber-900/60 font-semibold">
                        Calligraphy Chronicle (Long Prose)
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell the beautiful poetry of this chrysalis dreamscape..."
                        className="w-full px-4 py-3 bg-white/50 border border-amber-900/10 focus:border-amber-500 focus:bg-white rounded-xl outline-none font-sans text-sm text-amber-900 transition-all shadow-inner resize-none placeholder:text-amber-900/30 leading-relaxed"
                      />
                    </div>

                    {/* Image selector type toggle */}
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs uppercase tracking-wider text-amber-900/60 font-semibold">
                        Image Selection
                      </label>
                      <div className="flex bg-amber-950/5 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => { setImageType('upload'); setImage(''); }}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                            imageType === 'upload' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-900/50'
                          }`}
                        >
                          Custom Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => { setImageType('preset'); setImage(presets[0].url); }}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                            imageType === 'preset' ? 'bg-white text-amber-900 shadow-sm' : 'text-amber-900/50'
                          }`}
                        >
                          Magical Presets
                        </button>
                      </div>
                    </div>

                    {/* Image Content Render */}
                    {imageType === 'upload' ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative border-2 border-dashed border-amber-900/10 hover:border-amber-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/20">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {image ? (
                            <div className="flex flex-col items-center gap-2">
                              <img
                                src={image}
                                alt="Preview"
                                className="w-20 h-24 object-cover rounded-lg border border-amber-900/20 shadow-md"
                              />
                              <span className="font-sans text-xs text-amber-700 font-medium">Image Loaded Successfully</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-amber-900/40">
                              <Upload size={24} />
                              <span className="font-sans text-xs">Click or drag image file here</span>
                              <span className="text-[10px] opacity-60">PNG, JPG up to 3MB</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Preset image selector grids */
                      <div className="grid grid-cols-2 gap-2">
                        {presets.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setImage(p.url)}
                            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                              image === p.url ? 'border-amber-600 scale-[0.98]' : 'border-transparent hover:border-amber-300'
                            }`}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                              <span className="font-sans text-[10px] text-white font-medium">{p.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Display errors if any */}
                    {errorMsg && (
                      <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
                        <AlertCircle size={16} className="shrink-0" />
                        <span className="font-sans text-xs font-medium">{errorMsg}</span>
                      </div>
                    )}

                    {/* Form submit button */}
                    <button
                      type="submit"
                      className="mt-4 w-full py-4 bg-gradient-to-tr from-amber-700 to-rose-600 text-white rounded-xl shadow-md hover:shadow-lg font-sans font-semibold tracking-wider text-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                    >
                      MANIFEST DREAM
                    </button>
                  </form>
                )}

                {/* Manage Active Shards Section */}
                {cards && cards.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-amber-900/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-cursive text-3xl text-amber-800">
                        Active Keepsakes
                      </h3>
                      <button
                        type="button"
                        onClick={onClearAllCards}
                        className="text-[10px] tracking-wider text-rose-600 hover:text-rose-800 hover:underline uppercase font-sans font-semibold cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                    <p className="font-sans text-[10px] text-amber-900/40 uppercase tracking-widest font-light mb-4 text-left">
                      Selectively release shards back to the meadow
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {cards.map((card) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="group flex items-center justify-between p-3 bg-white/40 hover:bg-white/60 border border-white/50 hover:border-amber-500/20 rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-10 h-10 object-cover rounded-lg border border-amber-900/10 shadow-sm shrink-0 animate-fade-in"
                              />
                              <div className="text-left">
                                <h4 className="font-cursive text-xl text-amber-900 leading-tight">
                                  {card.title}
                                </h4>
                                <p className="font-sans text-[9px] uppercase tracking-wider text-amber-900/40">
                                  Shard No. {card.id}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => onDeleteCard(card.id)}
                              className="p-2 text-amber-900/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 shrink-0"
                              aria-label={`Release ${card.title}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer footer details */}
              <div className="pt-6 border-t border-amber-900/10 text-center">
                <p className="font-sans text-[10px] text-amber-900/40 uppercase tracking-[0.2em] font-light">
                  Aurelia's Chrysalis Shards: {cardsCount} of 11
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
