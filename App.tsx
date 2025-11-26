import React, { useState, useEffect } from 'react';
import { Trash2, CalendarClock, Sparkles, Sun, Phone, User } from 'lucide-react';
import AddBirthdayForm from './components/AddBirthdayForm';
import GeminiModal from './components/GeminiModal';
import { Birthday } from './types';

const App: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mafia_family_data');
    if (saved) {
      try {
        setBirthdays(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse birthdays", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mafia_family_data', JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (birthday: Birthday) => {
    setBirthdays(prev => [...prev, birthday]);
  };

  const deleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  // Helper to calculate days remaining and age
  const getBirthdayInfo = (dateStr: string) => {
    const today = new Date();
    const birthDate = new Date(dateStr);
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(dateStr);
    nextBirthday.setFullYear(currentYear);

    if (nextBirthday.getTime() < today.getTime() && nextBirthday.getDate() !== today.getDate()) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    // Set times to midnight for accurate day calculation
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const nextBirthdayMidnight = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());

    const diffTime = Math.abs(nextBirthdayMidnight.getTime() - todayMidnight.getTime());
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Age they will turn
    const age = nextBirthday.getFullYear() - birthDate.getFullYear();

    return { daysRemaining, age, nextDate: nextBirthday };
  };

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    const infoA = getBirthdayInfo(a.date);
    const infoB = getBirthdayInfo(b.date);
    return infoA.daysRemaining - infoB.daysRemaining;
  });

  const handleAiClick = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-orange-400 via-amber-200 to-amber-100 text-amber-900 font-sans selection:bg-amber-300">
      
      {/* Background Elements (CSS Art) */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-2xl opacity-60"></div>
      
      {/* Palm Tree Silhouette (SVG) */}
      <div className="fixed -bottom-10 -right-10 opacity-20 pointer-events-none select-none z-0">
         <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#451a03" d="M100,160 Q110,120 105,100 C105,100 130,110 140,120 C130,90 115,95 115,95 C145,85 160,95 160,95 C140,70 120,80 120,80 C135,50 150,60 150,60 C120,60 110,80 110,80 C115,40 125,50 125,50 C105,60 100,80 100,80 C95,45 105,30 105,30 C85,60 90,80 90,80 C70,40 80,30 80,30 C75,70 85,80 85,80 C50,50 60,70 60,70 C80,85 90,90 90,90 C50,90 60,110 60,110 C85,100 95,100 95,100 Q90,120 100,160 Z" />
            <path fill="#451a03" d="M20,160 Q40,130 50,110 C50,110 30,120 20,130 C40,100 50,105 50,105 C30,90 20,100 20,100 C40,80 50,90 50,90 C40,60 30,70 30,70 C50,80 60,95 60,95 L65,160 Z" transform="translate(10, 20) scale(0.8)"/>
         </svg>
      </div>

      {/* Mafia Silhouette (SVG) */}
      <div className="fixed bottom-0 left-10 opacity-10 pointer-events-none select-none z-0">
         <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="#451a03" d="M20,50 Q50,20 80,50 L90,55 L10,55 L20,50 Z M10,55 L90,55 L95,65 L5,65 Z" />
            <circle cx="35" cy="75" r="10" fill="#451a03" />
            <circle cx="65" cy="75" r="10" fill="#451a03" />
            <path fill="#451a03" d="M45,75 Q50,75 55,75 L50,85 Z" />
         </svg>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/30 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
             <Sun className="w-8 h-8 text-orange-500 mr-2" />
             <span className="text-orange-800 font-bold tracking-widest text-xs uppercase">Summer Vibe 1984</span>
          </div>
          <h1 className="font-mafia text-5xl md:text-7xl font-bold text-amber-900 mb-2 drop-shadow-sm">
            Cosa Nostra
          </h1>
          <div className="h-1 w-32 bg-amber-800 mx-auto mb-2"></div>
          <p className="text-amber-800 font-medium tracking-[0.3em] uppercase text-sm md:text-base">
            Семейная База
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Form */}
          <div className="lg:col-span-1 space-y-8">
            <AddBirthdayForm onAdd={addBirthday} />
            
            <div className="p-6 rounded-sm border border-amber-800/20 bg-amber-900/5 backdrop-blur-sm shadow-inner relative overflow-hidden">
               {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/40 rotate-1 border-l border-r border-white/40 shadow-sm"></div>

              <h3 className="text-amber-900 uppercase tracking-widest text-xs font-bold mb-4 border-b border-amber-800/20 pb-2">Сводка Семьи</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-800 font-serif italic">Членов семьи</span>
                <span className="text-orange-600 font-mafia text-2xl font-bold">{birthdays.length}</span>
              </div>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-full opacity-80" style={{ width: `${Math.min(birthdays.length * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            {sortedBirthdays.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-amber-800/20 rounded-lg bg-white/20 text-amber-800/60">
                <CalendarClock className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-mafia text-xl">Список пуст. Добавьте людей.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {sortedBirthdays.map((birthday) => {
                  const { daysRemaining, age, nextDate } = getBirthdayInfo(birthday.date);
                  const isToday = daysRemaining === 0;
                  const isSoon = daysRemaining > 0 && daysRemaining <= 7;

                  return (
                    <div 
                      key={birthday.id} 
                      className={`group relative bg-[#fffdf5] border ${isToday ? 'border-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.3)]' : 'border-amber-200 shadow-md hover:shadow-xl'} rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                    >
                      {/* Texture overlay */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

                      {/* Status Tag */}
                      {isToday && <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">Праздник</div>}
                      {isSoon && !isToday && <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">Скоро</div>}

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-mafia font-bold text-amber-950 flex items-center gap-2 leading-tight">
                              {birthday.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-widest font-bold rounded-sm">
                                  {birthday.relationship}
                                </span>
                            </div>
                          </div>
                          
                          <div className={`text-right ${isToday ? 'text-orange-600' : 'text-amber-600'}`}>
                            {!isToday && (
                                <div className="font-mafia text-4xl font-bold opacity-20 group-hover:opacity-40 transition-opacity absolute right-0 top-6">
                                    {daysRemaining}
                                </div>
                            )}
                          </div>
                        </div>

                        {birthday.phoneNumber && (
                          <div className="flex items-center gap-2 text-amber-700/70 mb-3 text-sm font-mono bg-amber-50 inline-block px-2 py-1 rounded border border-amber-100">
                             <Phone className="w-3 h-3" />
                             {birthday.phoneNumber}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-amber-100 border-dashed">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-amber-500 uppercase font-bold">Дата</span>
                              <span className="font-serif text-amber-900">{nextDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                            </div>
                            <div className="w-px h-8 bg-amber-200"></div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-amber-500 uppercase font-bold">Лет</span>
                              <span className="font-serif text-amber-900">{age}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Reveal on Hover/Mobile */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-amber-100">
                          <button 
                            onClick={() => handleAiClick(birthday)}
                            className="p-2 rounded bg-amber-100 text-amber-700 hover:bg-orange-500 hover:text-white transition-all"
                            title="Спросить Дона"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteBirthday(birthday.id)}
                            className="p-2 rounded bg-amber-100 text-amber-700 hover:bg-red-600 hover:text-white transition-all"
                            title="Убрать"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBirthday && selectedBirthday.date && (
        <GeminiModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          birthday={selectedBirthday}
          age={getBirthdayInfo(selectedBirthday.date).age}
        />
      )}
    </div>
  );
};

export default App;