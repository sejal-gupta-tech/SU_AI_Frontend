import { ReelJobStatus } from "@/types/reel";

interface ReelResultProps {
  result: ReelJobStatus;
  onReset: () => void;
}

export function ReelResult({ result, onReset }: ReelResultProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-100/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-green-100 rounded-xl">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Reel is Ready!</h2>
        </div>
        
        {result.video_url ? (
          <div className="flex flex-col xl:flex-row gap-10">
            {/* Video Player */}
            <div className="w-full xl:w-1/2 flex justify-center bg-black/5 rounded-3xl overflow-hidden shadow-inner border border-gray-100/50 p-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
              <video 
                src={result.video_url} 
                controls 
                autoPlay
                className="w-full max-h-[650px] object-contain rounded-2xl shadow-lg"
                poster={result.thumbnail_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Details & Script */}
            <div className="w-full xl:w-1/2 flex flex-col">
              <div className="flex-grow space-y-8">
                {result.script && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">{result.script.title}</h3>
                    <div className="flex gap-3">
                      <span className="text-3xl text-indigo-300 font-serif leading-none">"</span>
                      <p className="text-lg text-gray-700 italic font-medium leading-relaxed">{result.script.hook}</p>
                    </div>
                  </div>
                )}
                
                {result.caption && (
                  <div className="px-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Caption</h4>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg bg-gray-50/50 p-4 rounded-xl border border-gray-100">{result.caption}</p>
                  </div>
                )}

                {result.hashtags && result.hashtags.length > 0 && (
                  <div className="px-2">
                    <div className="flex flex-wrap gap-2.5">
                      {result.hashtags.map((tag) => (
                        <span key={tag} className="rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:shadow hover:border-indigo-200 transition-all cursor-default">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-10 pt-6 border-t border-gray-100">
                <a 
                  href={result.video_url} 
                  download 
                  target="_blank"
                  className="flex-1 flex justify-center items-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 font-bold text-white hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download HD
                </a>
                <button 
                  onClick={onReset}
                  className="flex-1 flex justify-center items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 font-bold text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-[0.98]"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Video file could not be loaded. Please check your content library.
          </div>
        )}
      </div>

      {/* Script Breakdown */}
      {result.script && result.script.scenes && (
        <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-8 shadow-xl shadow-indigo-100/30">
          <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 text-gray-900">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Scene-by-Scene Breakdown
          </h3>
          <div className="space-y-6">
            {result.script.scenes.map((scene, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                  <span className="bg-indigo-50 text-indigo-700 text-sm font-extrabold px-3 py-1.5 rounded-lg border border-indigo-100">
                    Scene {scene.scene_number}
                  </span>
                  <span className="text-sm font-semibold text-gray-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {scene.duration_seconds} seconds
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative">
                    <span className="absolute -left-3 top-0 w-1 h-full bg-blue-100 rounded-full"></span>
                    <span className="block text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 ml-2">Visual Direction</span>
                    <p className="text-base text-gray-700 font-medium ml-2 leading-relaxed">{scene.visual}</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-3 top-0 w-1 h-full bg-purple-100 rounded-full"></span>
                    <span className="block text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 ml-2">Voiceover</span>
                    <p className="text-base text-gray-800 italic ml-2 leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">"{scene.voiceover}"</p>
                  </div>
                </div>
                {scene.on_screen_text && (
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <span className="block text-xs font-bold text-pink-500 uppercase tracking-widest mb-2">On-Screen Text</span>
                    <p className="text-lg font-bold text-gray-900 bg-pink-50/50 inline-block px-4 py-2 rounded-xl border border-pink-100/50">{scene.on_screen_text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
