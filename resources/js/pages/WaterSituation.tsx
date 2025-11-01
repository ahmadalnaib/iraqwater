import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Add proper TypeScript interfaces
interface VoteStats {
  yes: number;
  no: number;
}

interface PageProps {
  stats: VoteStats;
}

type VoteChoice = 'yes' | 'no';

export default function WaterSituation() {
  const { stats: initialStats } = usePage<PageProps>().props;
  const { data, setData, post, processing } = useForm<{ choice: VoteChoice | '' }>({ choice: '' });
  const [stats, setStats] = useState<VoteStats>(initialStats);
  const [selected, setSelected] = useState<VoteChoice | null>(null);

  const handleVote = (choice: VoteChoice) => {
    if (processing) return;

    setData('choice', choice);
    setSelected(choice);

    post('/vote', {
      onSuccess: () => {
        setStats(prevStats => ({
          ...prevStats,
          [choice]: prevStats[choice] + 1
        }));
      },
      onError: (errors) => {
        console.error('Vote submission failed:', errors);
        setSelected(null);
        alert('فشل في إرسال التصويت. يرجى المحاولة مرة أخرى.');
      },
    });
  };

  const chartData = {
    labels: ['2016','2017','2018','2019','2020','2021','2022','2023','2024'],
    datasets: [
      { 
        label: 'دجلة (%)', 
        data: [80,76,70,65,58,50,44,38,35], 
        borderColor: 'rgba(239, 68, 68, 1)', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
        tension: 0.3,
        borderWidth: 3 
      },
      { 
        label: 'الفرات (%)', 
        data: [85,82,78,73,68,60,55,48,42], 
        borderColor: 'rgba(234, 88, 12, 1)', 
        backgroundColor: 'rgba(234, 88, 12, 0.1)', 
        tension: 0.3,
        borderWidth: 3 
      },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-red-400 drop-shadow-2xl">
            أزمة المياه
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
            دجلة والفرات في خطر
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8">
            نهرا العراق العظيمان يواجهان أسوأ أزمة في التاريخ الحديث
          </p>
          <div className="bg-red-600 bg-opacity-90 p-6 rounded-xl inline-block">
            <p className="text-2xl font-bold">⚠️ انخفاض بنسبة 65% في مستوى المياه</p>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-8">
        {/* Crisis Statistics */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">الأرقام المأساوية</h2>
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="bg-gradient-to-br from-red-900 to-red-800 p-8 rounded-2xl text-center border border-red-600">
                <div className="text-4xl font-black text-red-300 mb-2">65%</div>
                <div className="text-sm text-red-200">انخفاض في منسوب دجلة</div>
              </div>
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-8 rounded-2xl text-center border border-orange-600">
                <div className="text-4xl font-black text-orange-300 mb-2">58%</div>
                <div className="text-sm text-orange-200">انخفاض في منسوب الفرات</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-8 rounded-2xl text-center border border-yellow-600">
                <div className="text-4xl font-black text-yellow-300 mb-2">7M</div>
                <div className="text-sm text-yellow-200">مواطن متأثر بالأزمة</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-center border border-gray-600">
                <div className="text-4xl font-black text-gray-300 mb-2">40%</div>
                <div className="text-sm text-gray-200">نقص في المحاصيل الزراعية</div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery of Crisis */}
        <section className="py-16 bg-slate-800 bg-opacity-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">صور الأزمة</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1594736797933-d0a9ba10254c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="جفاف الأنهار" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">جفاف الأنهار</h3>
                  <p className="text-gray-200 text-sm">قيعان الأنهار تظهر للعيان</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1573160813759-54340ed1087d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="الأراضي المتصحرة" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">تصحر الأراضي</h3>
                  <p className="text-gray-200 text-sm">أراضي زراعية خصبة تتحول لصحراء</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="نفوق الأسماك" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">نفوق الأحياء المائية</h3>
                  <p className="text-gray-200 text-sm">موت الثروة السمكية بسبب التلوث</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Causes */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">الأسباب الرئيسية</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-red-900 to-red-800 p-8 rounded-2xl border border-red-600">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏗️</div>
                  <h3 className="text-2xl font-bold text-red-200">سدود دول الجوار</h3>
                </div>
                <p className="text-red-100 leading-relaxed mb-4">
                  إقامة أكثر من 22 سد في تركيا و16 سد في إيران أدى إلى انخفاض تدفق المياه بنسبة تزيد عن 60%
                </p>
                <ul className="text-red-200 space-y-2">
                  <li>• سد أتاتورك: يحجز 48 مليار متر مكعب</li>
                  <li>• سد إليسو: يهدد بقطع 60% من مياه دجلة</li>
                  <li>• سدود إيرانية: تحول مجرى الأنهار</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-8 rounded-2xl border border-orange-600">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🌡️</div>
                  <h3 className="text-2xl font-bold text-orange-200">التغير المناخي</h3>
                </div>
                <p className="text-orange-100 leading-relaxed mb-4">
                  ارتفاع درجات الحرارة وقلة الأمطار أدت إلى تفاقم الأزمة وزيادة معدلات التبخر
                </p>
                <ul className="text-orange-200 space-y-2">
                  <li>• ارتفاع درجات الحرارة 2.3 درجة مئوية</li>
                  <li>• انخفاض الأمطار بنسبة 40%</li>
                  <li>• زيادة معدلات التبخر 3 أضعاف</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">انخفاض منسوب المياه عبر السنوات</h2>
            <div className="bg-slate-800 bg-opacity-80 p-8 rounded-2xl border border-red-900">
              <Line 
                data={chartData} 
                options={{ 
                  responsive: true, 
                  plugins: { 
                    legend: { 
                      labels: { 
                        color: '#e6eef8',
                        font: { size: 16 }
                      } 
                    },
                    title: {
                      display: true,
                      text: 'النسبة المئوية لانخفاض منسوب المياه',
                      color: '#ef4444',
                      font: { size: 20 }
                    }
                  }, 
                  scales: { 
                    x: { 
                      ticks: { 
                        color: '#e6eef8',
                        font: { size: 14 }
                      },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    }, 
                    y: { 
                      ticks: { 
                        color: '#e6eef8',
                        font: { size: 14 }
                      },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    } 
                  } 
                }} 
              />
            </div>
          </div>
        </section>

        {/* Impact on People */}
        <section className="py-16 bg-slate-800 bg-opacity-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">التأثير على الشعب</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍🌾</div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">المزارعون</h3>
                <p className="text-gray-300">فقدان المحاصيل وترك الأراضي الزراعية</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🏘️</div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">سكان المدن</h3>
                <p className="text-gray-300">نقص في المياه الصالحة للشرب والاستخدام المنزلي</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🐟</div>
                <h3 className="text-xl font-bold mb-3 text-green-400">الصيادون</h3>
                <p className="text-gray-300">انقراض الأسماك وفقدان مصادر الرزق</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">خريطة المناطق المتضررة</h2>
            <div className="bg-slate-800 bg-opacity-80 p-8 rounded-2xl border border-red-900">
              <MapContainer center={[33.3128, 44.3615]} zoom={6} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[33.3128, 44.3615]}>
                  <Popup>دجلة - انخفاض حاد في منسوب المياه</Popup>
                </Marker>
                <Marker position={[32.5, 44.0]}>
                  <Popup>الفرات - جفاف شديد</Popup>
                </Marker>
                <Marker position={[31.0, 47.0]}>
                  <Popup>الأهوار - تدهور بيئي خطير</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-green-400">الحلول العاجلة المطلوبة</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-2xl border border-green-600">
                  <h3 className="text-xl font-bold mb-3 text-green-200">🤝 التعاون الإقليمي</h3>
                  <p className="text-green-100">اتفاقيات مياه عادلة مع تركيا وإيران لضمان الحصص المائية</p>
                </div>
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-2xl border border-blue-600">
                  <h3 className="text-xl font-bold mb-3 text-blue-200">💧 تقنيات الري الحديثة</h3>
                  <p className="text-blue-100">استخدام الري بالتنقيط وتقليل هدر المياه بنسبة 50%</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-6 rounded-2xl border border-purple-600">
                  <h3 className="text-xl font-bold mb-3 text-purple-200">🌊 محطات التحلية</h3>
                  <p className="text-purple-100">إنشاء محطات تحلية مياه البحر لتوفير البديل</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 p-6 rounded-2xl border border-yellow-600">
                  <h3 className="text-xl font-bold mb-3 text-yellow-200">🌱 إعادة التشجير</h3>
                  <p className="text-yellow-100">زراعة الأشجار لزيادة هطول الأمطار وتقليل التصحر</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voting Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-8 rounded-3xl border-2 border-red-600 text-center">
              <h2 className="text-4xl font-bold mb-6 text-red-200">صوتك يهم!</h2>
              <p className="text-2xl mb-8 text-red-100">هل تؤيد اتخاذ إجراءات عاجلة لمعالجة أزمة المياه؟</p>
              
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleVote('yes')}
                  disabled={processing}
                  className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 ${
                    processing 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : selected === 'yes' 
                        ? 'bg-green-600 shadow-lg shadow-green-600/50' 
                        : 'bg-green-700 hover:bg-green-600 hover:shadow-lg hover:shadow-green-600/30'
                  }`}>
                  {processing ? '⏳ جاري التصويت...' : `✅ نعم، عاجل جداً (${stats.yes})`}
                </button>
                
                <button
                  onClick={() => handleVote('no')}
                  disabled={processing}
                  className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 ${
                    processing 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : selected === 'no' 
                        ? 'bg-red-600 shadow-lg shadow-red-600/50' 
                        : 'bg-red-700 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/30'
                  }`}>
                  {processing ? '⏳ جاري التصويت...' : `❌ لا، ليس الآن (${stats.no})`}
                </button>
              </div>
              
              <div className="mt-8 text-red-200">
                <p className="text-lg">مجموع الأصوات: {stats.yes + stats.no}</p>
                <div className="flex justify-center mt-4">
                  <div className="bg-green-600 h-4 rounded-l-full" style={{width: `${(stats.yes / (stats.yes + stats.no)) * 200}px`}}></div>
                  <div className="bg-red-600 h-4 rounded-r-full" style={{width: `${(stats.no / (stats.yes + stats.no)) * 200}px`}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-slate-400 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg mb-4">© 2025 IraqWater.org - من أجل إنقاذ مياه العراق</p>
            <p className="text-sm">كل قطرة مياه تهم. كل صوت يحدث فرقاً.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}