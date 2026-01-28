import React, { useState, useEffect } from 'react';
import { Trash2, CalendarClock, Sparkles, Sun, Phone, User, ShieldAlert } from 'lucide-react';
import AddBirthdayForm from './components/AddBirthdayForm';
import GeminiModal from './components/GeminiModal';
import { Birthday } from './types';

const calculateDaysUntil = (dateString: string) => {
  const today = new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  const nextBirthday = new Date(today.getFullYear(), month - 1, day);

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 365 || diffDays === 0 ? "0" : diffDays;
};

const App: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('mafia_family_data', JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (birthday: Birthday) => {
    setBirthdays(prev => [...prev, birthday]);
  };

  const deleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  const getExpiryInfo = (expiryDateStr?: string) => {
    if (!expiryDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysLeft,
      isExpired: daysLeft < 0,
    };
  };

  const getBirthdayInfo = (dateStr: string) => {
    const today = new Date();
    const birthDate = new Date(dateStr);
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(dateStr);
    nextBirthday.setFullYear(currentYear);

    if (nextBirthday.getTime() < today.getTime() && nextBirthday.getDate() !== today.getDate()) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const nextBirthdayMidnight = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());

    const diffTime = Math.abs(nextBirthdayMidnight.getTime() - todayMidnight.getTime());
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
      <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-2xl opacity-60"></div>
      
      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/30 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
             <ShieldAlert className="w-8 h-8 text-orange-500 mr-2" />
             <span className="text-orange-800 font-bold tracking-widest text-xs uppercase">Дни Рождения Семьи by Jonny</span>
          </div>
          <h1 className="font-mafia text-5xl md:text-7xl font-bold text-amber-900 mb-2 drop-shadow-sm">Cosa Nostra</h1>
          <p className="text-amber-800 font-medium tracking-[0.3em] uppercase text-sm md:text-base">Семейная База</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <AddBirthdayForm onAdd={addBirthday} />
          </div>

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
                  const expiryInfo = getExpiryInfo(birthday.expiryDate);
                  const isToday = daysRemaining === 0;

                  return (
                    <div 
                      key={birthday.id} 
                      className={`group relative bg-[#fffdf5] border ${isToday ? 'border-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.3)]' : 'border-amber-200 shadow-md hover:shadow-xl'} rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                    >
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

                      <div className="relative z-10">
                        {/* Тот самый счетчик из старой версии */}
                        <div className="absolute -top-2 -right-1 text-right select-none pointer-events-none">
                          <div className="text-6xl font-serif text-amber-900/[0.08] leading-none tracking-tighter">
                            {calculateDaysUntil(birthday.date)}
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-amber-900/30 mt-1 mr-1">
                            дней
                          </div>
                        </div>

                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full border-2 border-amber-800/10 overflow-hidden bg-amber-50 flex-shrink-0 shadow-inner">
                            {birthday.avatar ? (
                              <img src={birthday.avatar} alt={birthday.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-full h-full p-3 text-amber-800/20" />
                            )}
                          </div>

                          <div>
                            <h3 className="text-2xl font-mafia font-bold text-amber-950 leading-tight">
                              {birthday.name}
                            </h3>
                            <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] uppercase tracking-widest font-bold rounded-sm mt-1">
                              {birthday.relationship}
                            </span>
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
                            
                            {expiryInfo && (
                              <>
                                <div className="w-px h-8 bg-amber-200"></div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-amber-500 uppercase font-bold">Контракт</span>
                                  <span className={`font-serif ${expiryInfo.isExpired ? 'text-red-600 font-bold' : 'text-amber-900'}`}>
                                    {expiryInfo.isExpired ? 'Истёк' : `${expiryInfo.daysLeft} дн.`}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

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