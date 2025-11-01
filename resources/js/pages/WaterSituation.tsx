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
  hasVoted: boolean; // Add this to know if user already voted
  flash?: {
    error?: string;
    success?: string;
  };
}

type VoteChoice = 'yes' | 'no';

export default function WaterSituation() {
  const { stats: initialStats, hasVoted: initialHasVoted, flash } = usePage<PageProps>().props;
  const { data, setData, post, processing } = useForm<{ choice: VoteChoice | '' }>({ choice: '' });
  const [stats, setStats] = useState<VoteStats>(initialStats);
  const [selected, setSelected] = useState<VoteChoice | null>(null);
  const [voteMessage, setVoteMessage] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(initialHasVoted); // Initialize from server

  const handleVote = (choice: VoteChoice) => {
    if (processing) return;

    setData('choice', choice);
    setSelected(choice);
    setVoteMessage('');

    post('/vote', {
      preserveScroll: true,
      onSuccess: () => {
        setStats(prevStats => ({
          ...prevStats,
          [choice]: prevStats[choice] + 1
        }));
        setVoteMessage('تم تسجيل صوتك بنجاح! شكراً لمشاركتك.');
        setHasVoted(true);
        setSelected(null);
      },
      onError: (errors) => {
        console.error('Vote submission failed:', errors);
        setSelected(null);
        setVoteMessage('لقد قمت بالتصويت مسبقاً من هذا الجهاز. التصويت مسموح مرة واحدة فقط.');
        setHasVoted(true);
      },
    });
  };

  // Function to scroll to voting section
  const scrollToVoting = () => {
    const votingSection = document.getElementById('voting-section');
    if (votingSection) {
      votingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const chartData = {
    labels: ['2016','2017','2018','2019','2020','2021','2022','2023','2024'],
    datasets: [
      { 
        label: 'دجلة (%)', 
        data: [100,95,88,82,75,68,58,48,35], 
        borderColor: 'rgba(239, 68, 68, 1)', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
        tension: 0.3,
        borderWidth: 3 
      },
      { 
        label: 'الفرات (%)', 
        data: [100,92,85,78,68,55,45,35,30], 
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
          <div className="bg-red-600 bg-opacity-90 p-6 rounded-xl inline-block mb-6">
            <p className="text-2xl font-bold mb-4">⚠️ انخفاض بنسبة 70% في مستوى المياه</p>
            <button
              onClick={scrollToVoting}
              className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              صوت الآن للمساعدة! 🗳️
            </button>
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
                <div className="text-4xl font-black text-red-300 mb-2">45%</div>
                <div className="text-sm text-red-200">انخفاض في منسوب دجلة</div>
              </div>
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-8 rounded-2xl text-center border border-orange-600">
                <div className="text-4xl font-black text-orange-300 mb-2">65%</div>
                <div className="text-sm text-orange-200">انخفاض في منسوب الفرات</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-8 rounded-2xl text-center border border-yellow-600">
                <div className="text-4xl font-black text-yellow-300 mb-2">12M</div>
                <div className="text-sm text-yellow-200">مواطن متأثر بالأزمة</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-center border border-gray-600">
                <div className="text-4xl font-black text-gray-300 mb-2">60%</div>
                <div className="text-sm text-gray-200">نقص في المحاصيل الزراعية</div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery of Crisis - Extended */}
        <section className="py-16 bg-slate-800 bg-opacity-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">صور الأزمة</h2>
            
            {/* First Row */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="/img/1.jpg" 
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

            {/* Second Row */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="المزارعون المتضررون" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">المزارعون المتضررون</h3>
                  <p className="text-gray-200 text-sm">فقدان المحاصيل ومصادر العيش</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="الأهوار المجففة" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">الأهوار المجففة</h3>
                  <p className="text-gray-200 text-sm">جفاف 90% من أهوار العراق</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="نقص المياه الصالحة للشرب" 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">أزمة مياه الشرب</h3>
                  <p className="text-gray-200 text-sm">نقص المياه الصالحة للاستهلاك البشري</p>
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
                  <li>• سد بيرجيك: يقلل تدفق الفرات 40%</li>
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
                  <li>• موجات جفاف متتالية منذ 2018</li>
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
                      text: 'النسبة المئوية لمنسوب المياه (المتبقي من المستوى الطبيعي)',
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
                      grid: { color: 'rgba(255,255,255,0.1)' },
                      min: 0,
                      max: 100
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
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center bg-slate-700 p-6 rounded-2xl">
                <div className="text-6xl mb-4">👨‍🌾</div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">المزارعون</h3>
                <p className="text-gray-300 mb-2">فقدان المحاصيل وترك الأراضي الزراعية</p>
                <div className="text-yellow-300 font-bold">2.5 مليون مزارع متضرر</div>
              </div>
              <div className="text-center bg-slate-700 p-6 rounded-2xl">
                <div className="text-6xl mb-4">🏘️</div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">سكان المدن</h3>
                <p className="text-gray-300 mb-2">نقص في المياه الصالحة للشرب والاستخدام المنزلي</p>
                <div className="text-blue-300 font-bold">8 مليون مواطن متأثر</div>
              </div>
              <div className="text-center bg-slate-700 p-6 rounded-2xl">
                <div className="text-6xl mb-4">🐟</div>
                <h3 className="text-xl font-bold mb-3 text-green-400">الصيادون</h3>
                <p className="text-gray-300 mb-2">انقراض الأسماك وفقدان مصادر الرزق</p>
                <div className="text-green-300 font-bold">50 ألف صياد فقد عمله</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center bg-slate-700 p-6 rounded-2xl">
                <div className="text-6xl mb-4">🐄</div>
                <h3 className="text-xl font-bold mb-3 text-amber-400">مربي الماشية</h3>
                <p className="text-gray-300 mb-2">نفوق الحيوانات وفقدان المراعي</p>
                <div className="text-amber-300 font-bold">1.5 مليون رأس ماشية نافقة</div>
              </div>
              <div className="text-center bg-slate-700 p-6 rounded-2xl">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">النازحون</h3>
                <p className="text-gray-300 mb-2">هجرة من الريف إلى المدن بحثاً عن المياه</p>
                <div className="text-purple-300 font-bold">500 ألف نازح داخلي</div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section - Complete */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-400">خريطة المناطق المتضررة</h2>
            <div className="bg-slate-800 bg-opacity-80 p-8 rounded-2xl border border-red-900">
              <MapContainer center={[33.3128, 44.3615]} zoom={6} style={{ height: '500px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* نهر دجلة */}
                <Marker position={[36.34, 43.13]}>
                  <Popup>الموصل - انخفاض حاد في مياه دجلة (50%)</Popup>
                </Marker>
                <Marker position={[34.79, 43.68]}>
                  <Popup>تكريت - جفاف أجزاء من النهر (45%)</Popup>
                </Marker>
                <Marker position={[33.3128, 44.3615]}>
                  <Popup>بغداد - انخفاض منسوب دجلة (40%)</Popup>
                </Marker>
                <Marker position={[32.18, 45.18]}>
                  <Popup>الكوت - تراجع كبير في المياه (55%)</Popup>
                </Marker>
                <Marker position={[31.99, 46.11]}>
                  <Popup>العمارة - انخفاض خطير (60%)</Popup>
                </Marker>
                <Marker position={[30.96, 46.97]}>
                  <Popup>البصرة - أزمة مياه حادة (70%)</Popup>
                </Marker>

                {/* نهر الفرات */}
                <Marker position={[34.42, 40.88]}>
                  <Popup>القائم - الحدود مع سوريا (80%)</Popup>
                </Marker>
                <Marker position={[34.37, 41.87]}>
                  <Popup>عانة - انخفاض شديد (75%)</Popup>
                </Marker>
                <Marker position={[33.74, 42.39]}>
                  <Popup>هيت - مستوى منخفض جداً (70%)</Popup>
                </Marker>
                <Marker position={[33.41, 43.31]}>
                  <Popup>الفلوجة - أزمة مياه (65%)</Popup>
                </Marker>
                <Marker position={[32.56, 44.42]}>
                  <Popup>الحلة - تراجع كبير (60%)</Popup>
                </Marker>
                <Marker position={[32.03, 44.90]}>
                  <Popup>الديوانية - نقص حاد (65%)</Popup>
                </Marker>
                <Marker position={[31.32, 45.32]}>
                  <Popup>السماوة - جفاف شديد (70%)</Popup>
                </Marker>
                <Marker position={[31.04, 46.26]}>
                  <Popup>الناصرية - أزمة خطيرة (75%)</Popup>
                </Marker>

                {/* الأهوار */}
                <Marker position={[31.0, 47.0]}>
                  <Popup>هور الحمار - جفاف 90%</Popup>
                </Marker>
                <Marker position={[31.5, 47.2]}>
                  <Popup>هور الحويزة - تدهور بيئي 85%</Popup>
                </Marker>
                <Marker position={[30.8, 46.8]}>
                  <Popup>الأهوار الوسطى - جفاف شامل 95%</Popup>
                </Marker>

                {/* محافظات أخرى متضررة */}
                <Marker position={[33.38, 44.39]}>
                  <Popup>الأنبار - نقص في المياه الجوفية (50%)</Popup>
                </Marker>
                <Marker position={[32.48, 45.84]}>
                  <Popup>واسط - تأثر الزراعة (55%)</Popup>
                </Marker>
                <Marker position={[31.06, 46.24]}>
                  <Popup>ذي قار - أزمة مياه شرب (60%)</Popup>
                </Marker>
                <Marker position={[30.51, 47.81]}>
                  <Popup>ميسان - جفاف الأهوار (70%)</Popup>
                </Marker>

                {/* المناطق الحدودية المتضررة */}
                <Marker position={[35.46, 44.39]}>
                  <Popup>أربيل - تأثر الزراعة (35%)</Popup>
                </Marker>
                <Marker position={[36.19, 44.01]}>
                  <Popup>دهوك - نقص في الموارد (30%)</Popup>
                </Marker>
                <Marker position={[35.56, 45.43]}>
                  <Popup>السليمانية - تراجع المياه (40%)</Popup>
                </Marker>

                {/* مناطق زراعية متضررة */}
                <Marker position={[33.75, 43.68]}>
                  <Popup>صلاح الدين - فشل المحاصيل (50%)</Popup>
                </Marker>
                <Marker position={[32.19, 44.93]}>
                  <Popup>بابل - تصحر الأراضي (45%)</Popup>
                </Marker>
                
                {/* مناطق إضافية */}
                <Marker position={[32.61, 44.02]}>
                  <Popup>كربلاء - نقص المياه المقدسة (50%)</Popup>
                </Marker>
                <Marker position={[32.03, 45.38]}>
                  <Popup>النجف - تأثر بحر النجف (80%)</Popup>
                </Marker>
                <Marker position={[34.33, 43.96]}>
                  <Popup>سامراء - انخفاض مستوى دجلة (40%)</Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Legend for the map */}
            <div className="mt-6 bg-slate-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-center text-red-400">دليل الخريطة - نسبة انخفاض المياه</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                  <span>أزمة حادة جداً (+70%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                  <span>أزمة حادة (50-70%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>أزمة متوسطة (30-50%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>الأهوار المجففة (85-95%)</span>
                </div>
              </div>
              <div className="mt-4 text-center text-gray-300">
                <p>المجموع: 22+ موقع متضرر في جميع محافظات العراق</p>
              </div>
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
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-6 rounded-2xl border border-indigo-600">
                  <h3 className="text-xl font-bold mb-3 text-indigo-200">🔧 إصلاح البنية التحتية</h3>
                  <p className="text-indigo-100">تجديد شبكات المياه وإيقاف التسربات</p>
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
                <div className="bg-gradient-to-r from-teal-900 to-teal-800 p-6 rounded-2xl border border-teal-600">
                  <h3 className="text-xl font-bold mb-3 text-teal-200">♻️ إعادة تدوير المياه</h3>
                  <p className="text-teal-100">معالجة مياه الصرف واستخدامها في الري</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voting Section */}
        <section id="voting-section" className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-8 rounded-3xl border-2 border-red-600 text-center">
              <h2 className="text-4xl font-bold mb-6 text-red-200">صوتك يهم!</h2>
              <p className="text-2xl mb-6 text-red-100">هل تؤيد اتخاذ إجراءات عاجلة لمعالجة أزمة المياه؟</p>
              
              {!hasVoted && (
                <p className="text-lg mb-8 text-yellow-200 bg-yellow-900 bg-opacity-30 p-3 rounded-lg inline-block">
                  ⚠️ يمكنك التصويت مرة واحدة فقط من هذا الجهاز
                </p>
              )}

              {/* Vote Message Display */}
              {voteMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  voteMessage.includes('بنجاح') 
                    ? 'bg-green-900 bg-opacity-50 text-green-200 border border-green-600' 
                    : 'bg-red-900 bg-opacity-50 text-red-200 border border-red-600'
                }`}>
                  <p className="text-lg font-semibold">{voteMessage}</p>
                </div>
              )}
              
              {/* Show buttons only if user hasn't voted */}
              {!hasVoted ? (
                <div className="flex justify-center gap-6 mb-8">
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
              ) : (
                <div className="mb-8">
                  <p className="text-xl text-slate-300 bg-slate-700 bg-opacity-50 p-4 rounded-lg inline-block">
                    🗳️ شكراً لمشاركتك في التصويت
                  </p>
                </div>
              )}
              
              {/* Always show results */}
              <div className="text-red-200">
                <h3 className="text-2xl font-bold mb-4 text-yellow-300">نتائج التصويت</h3>
                <p className="text-lg mb-4">مجموع الأصوات: {stats.yes + stats.no}</p>
                
                {/* Enhanced results display */}
                <div className="bg-slate-800 bg-opacity-50 p-6 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-600">
                      <div className="text-3xl font-bold text-green-300 mb-2">{stats.yes}</div>
                      <div className="text-green-200">نعم، عاجل جداً</div>
                      <div className="text-2xl font-bold text-green-400">
                        {stats.yes + stats.no > 0 ? Math.round((stats.yes / (stats.yes + stats.no)) * 100) : 0}%
                      </div>
                    </div>
                    
                    <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg border border-red-600">
                      <div className="text-3xl font-bold text-red-300 mb-2">{stats.no}</div>
                      <div className="text-red-200">لا، ليس الآن</div>
                      <div className="text-2xl font-bold text-red-400">
                        {stats.yes + stats.no > 0 ? Math.round((stats.no / (stats.yes + stats.no)) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="bg-gray-700 rounded-full overflow-hidden h-6">
                    <div 
                      className="bg-green-600 h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold float-left" 
                      style={{width: `${stats.yes + stats.no > 0 ? (stats.yes / (stats.yes + stats.no)) * 100 : 0}%`}}
                    >
                      {stats.yes + stats.no > 0 && (stats.yes / (stats.yes + stats.no)) * 100 > 15 ? 
                        `${Math.round((stats.yes / (stats.yes + stats.no)) * 100)}%` : ''}
                    </div>
                    <div 
                      className="bg-red-600 h-full transition-all duration-500 flex items-center justify-center text-white text-sm font-bold float-right" 
                      style={{width: `${stats.yes + stats.no > 0 ? (stats.no / (stats.yes + stats.no)) * 100 : 0}%`}}
                    >
                      {stats.yes + stats.no > 0 && (stats.no / (stats.yes + stats.no)) * 100 > 15 ? 
                        `${Math.round((stats.no / (stats.yes + stats.no)) * 100)}%` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-slate-400 py-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg mb-4">© 2025 IraqWater.org - من أجل إنقاذ مياه العراق</p>
            <p className="text-sm">كل قطرة مياه تهم. كل صوت يحدث فرقاً.</p>
            
            {/* Data Sources Section */}
            <div className="mt-6 p-4 bg-slate-800 bg-opacity-50 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-slate-300">مصادر البيانات</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>• وزارة الموارد المائية العراقية - التقرير السنوي 2024</p>
                <p>• برنامج الأمم المتحدة للبيئة (UNEP) - تقرير أزمة المياه في العراق</p>
                <p>• منظمة الأغذية والزراعة (FAO) - إحصائيات المياه الزراعية</p>
                <p>• البنك الدولي - تقرير الموارد المائية في الشرق الأوسط 2024</p>
                <p>• وكالة ناسا للفضاء - صور الأقمار الاصطناعية لمستوى المياه</p>
              </div>
              <div className="mt-3 flex justify-center space-x-4 text-xs">
                <a href="https://mowr.gov.iq" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  وزارة الموارد المائية
                </a>
                <span className="text-slate-500">|</span>
                <a href="https://www.unep.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  الأمم المتحدة للبيئة
                </a>
                <span className="text-slate-500">|</span>
                <a href="https://www.fao.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  منظمة الأغذية والزراعة
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}