import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المزادات', href: '/auctions' },
    { name: 'التصنيفات', href: '/categories' },
    { name: 'كيف يعمل الموقع', href: '/how-it-works' },
    { name: 'الأسئلة الشائعة', href: '/faq' }
  ];

  const legalLinks = [
    { name: 'الشروط والأحكام', href: '/terms' },
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'سياسة الاسترداد', href: '/refund-policy' },
    { name: 'قواعد المزايدة', href: '/bidding-rules' },
    { name: 'اتفاقية المستخدم', href: '/user-agreement' }
  ];

  const supportLinks = [
    { name: 'مركز المساعدة', href: '/help' },
    { name: 'اتصل بنا', href: '/contact' },
    { name: 'الدعم الفني', href: '/support' },
    { name: 'تقديم شكوى', href: '/complaints' },
    { name: 'البلاغات', href: '/reports' }
  ];

  const categories = [
    { name: 'السيارات', href: '/categories/cars' },
    { name: 'العقارات', href: '/categories/real-estate' },
    { name: 'الإلكترونيات', href: '/categories/electronics' },
    { name: 'المجوهرات', href: '/categories/jewelry' },
    { name: 'التحف والأنتيكات', href: '/categories/antiques' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              اشترك في النشرة الإخبارية
            </h3>
            <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
              احصل على أحدث المزادات والعروض الخاصة مباشرة في صندوق بريدك الإلكتروني
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  مزاد الفيديو
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                منصة المزادات الحديثة التي تجمع بين تقنية الفيديو المتطورة وتجربة المزايدة التفاعلية، لتوفر لك أفضل تجربة مزايدة عبر الإنترنت.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span>+966 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span>info@videoauction.sa</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-400">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">
                روابط سريعة
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center space-x-2 space-x-reverse group"
                    >
                      <span className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">
                التصنيفات الشائعة
              </h4>
              <ul className="space-y-4">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={category.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center space-x-2 space-x-reverse group"
                    >
                      <span className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">
                الدعم والمساعدة
              </h4>
              <ul className="space-y-4 mb-8">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200 flex items-center space-x-2 space-x-reverse group"
                    >
                      <span className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div>
                <h5 className="font-semibold mb-4 text-white">تابعنا على</h5>
                <div className="flex space-x-4 space-x-reverse">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-300 hover:scale-110"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile App Promotion */}
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-right mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  حمّل تطبيق مزاد الفيديو
                </h3>
                <p className="text-gray-300">
                  استمتع بتجربة مزايدة أفضل مع تطبيقنا المحمول
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 space-x-reverse bg-black rounded-xl px-6 py-3 hover:bg-gray-900 transition-colors group"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m11.4653-6.02h0l-.9993 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993l.9993 0c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m-11.4653 0h0l-.9993 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993l.9993 0c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997" />
                  </svg>
                  <div className="text-right">
                    <div className="text-xs text-gray-300">حمّل من</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 space-x-reverse bg-black rounded-xl px-6 py-3 hover:bg-gray-900 transition-colors group"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12L3.609 22.186C3.61 22.186 3.61 22.186 3.609 22.186C2.72 21.297 2.72 19.844 3.609 18.955L3.609 1.814Z" />
                  </svg>
                  <div className="text-right">
                    <div className="text-xs text-gray-300">حمّل من</div>
                    <div className="text-sm font-semibold text-white">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © {currentYear} مزاد الفيديو. جميع الحقوق محفوظة.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center items-center mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center space-x-8 space-x-reverse text-center">
              <div className="text-gray-500">
                <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3.09 8.26L12 22L20.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-xs">آمان وثقة</span>
              </div>
              <div className="text-gray-500">
                <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="text-xs">مدفوعات آمنة</span>
              </div>
              <div className="text-gray-500">
                <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-xs">جودة عالية</span>
              </div>
              <div className="text-gray-500">
                <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L9 9H1L7.5 14L5 22L12 17.5L19 22L16.5 14L23 9H15L12 1Z" />
                  </svg>
                </div>
                <span className="text-xs">دعم 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;