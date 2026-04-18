import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Tablet } from 'lucide-react';
import { deviceApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';

const brandInfo = {
  apple: {
    name: 'Apple iPhone',
    title: 'iPhone Repair Adelaide',
    description: 'Professional iPhone repair services in Kurralta Park, Adelaide. Screen replacement, battery repair, water damage recovery for all iPhone models.',
    icon: Smartphone,
  },
  samsung: {
    name: 'Samsung Galaxy',
    title: 'Samsung Phone Repair Adelaide',
    description: 'Expert Samsung repair for all Galaxy models including S series, A series, and foldables in Kurralta Park, Adelaide.',
    icon: Smartphone,
  },
  ipad: {
    name: 'Apple iPad',
    title: 'iPad Repair Adelaide',
    description: 'Specialized iPad repair services for all models including Pro, Air, and Mini in Kurralta Park, Adelaide.',
    icon: Tablet,
  },
  google: {
    name: 'Google Pixel',
    title: 'Google Pixel Repair Adelaide',
    description: 'Trusted Google Pixel repair services with quality parts and fast turnaround in Kurralta Park, Adelaide.',
    icon: Smartphone,
  },
};

export default function DevicesPage() {
  const { brand } = useParams();
  const [devices, setDevices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (brand) {
          const brandMap = {
            apple: 'Apple',
            samsung: 'Samsung',
            ipad: 'iPad',
            google: 'Google',
          };
          const actualBrand = brandMap[brand.toLowerCase()];
          if (actualBrand) {
            const res = await deviceApi.getByBrand(actualBrand);
            setDevices(res.data || []);
          }
        } else {
          const res = await deviceApi.getBrands();
          setBrands(res.data.brands || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brand]);

  const info = brand ? brandInfo[brand.toLowerCase()] : null;

  // Brand listing page
  if (!brand) {
    return (
      <div data-testid="devices-page">
        <SEO 
          title="Device Repair - iPhone, Samsung, iPad, Pixel"
          description="We repair all major phone brands including iPhone, Samsung, iPad, and Google Pixel in Kurralta Park, Adelaide. Same day repairs with 6 months warranty."
          keywords="iphone repair adelaide, samsung repair adelaide, ipad repair, google pixel repair, phone repair kurralta park"
        />
        
        <section className="py-16 lg:py-24 bg-[#F5F5F7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tighter mb-4">
              We Repair All Brands
            </h1>
            <p className="text-lg text-[#86868B] max-w-2xl mx-auto">
              Select your device brand to view available repair services and pricing in Kurralta Park, Adelaide.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(brandInfo).map(([key, value]) => (
                <Link
                  key={key}
                  to={`/devices/${key}`}
                  className="group p-8 bg-[#F5F5F7] rounded-[2rem] text-center transition-all hover:shadow-xl hover:scale-105"
                  data-testid={`brand-card-${key}`}
                >
                  <div className="w-16 h-16 bg-[#0071E3]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0071E3] transition-colors">
                    <value.icon className="w-8 h-8 text-[#0071E3] group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-[#1D1D1F] mb-2">
                    {value.name}
                  </h2>
                  <p className="text-sm text-[#86868B]">View repairs</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Device listing for specific brand
  return (
    <div data-testid={`devices-${brand}-page`}>
      <SEO 
        title={info?.title || `${brand} Repair Adelaide`}
        description={info?.description}
        keywords={`${brand} repair adelaide, ${brand} screen repair, ${brand} battery replacement, phone repair kurralta park`}
      />
      
      <section className="py-16 lg:py-24 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tighter mb-4">
            {info?.title || `${brand} Repair`}
          </h1>
          <p className="text-lg text-[#86868B] max-w-2xl mx-auto">
            {info?.description || 'Select your model to see repair options and pricing.'}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-[#F5F5F7] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {devices.map((device) => (
                <Link
                  key={device.id}
                  to="/book"
                  state={{ device }}
                  className="group p-6 bg-[#F5F5F7] rounded-xl text-center transition-all hover:bg-[#E8E8ED] hover:scale-105"
                  data-testid={`device-card-${device.id}`}
                >
                  <Smartphone className="w-8 h-8 text-[#1D1D1F] mx-auto mb-3" />
                  <h3 className="font-medium text-[#1D1D1F]">{device.name}</h3>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-[#86868B] mb-4">
              Don't see your model? We repair many more devices.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full px-6">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
