import arrow from './images/icon-arrow.svg'
import { useState, useEffect } from 'react'
import background from './images/pattern-bg.png'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MakerPosition from './MakerPosition'

function App() {

  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


  useEffect(() => {

    try {
      const getInitialData = async () => {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_CvyJjLGTlFJ3kzUqUGYWuaeJm4QDn&ipAddress=192.212.174.101`)
        const data = await res.json()
        setAddress(data)
      }
      getInitialData()
    }
    catch (error) {
      console.trace(error)
    }

  }, []);

  async function getAddress() {
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_CvyJjLGTlFJ3kzUqUGYWuaeJm4QDn&${
      checkIpAddress.test(ipAddress) ? `ipAddress=${ipAddress}` : checkDomain.test(checkDomain) ? `domain=${ipAddress}` : ""}`)
    const data = await res.json()
    setAddress(data)
  }

  function handleSubmit(e) {
    e.preventDefault();
    getAddress()
    setIpAddress('')
  }

  return (
    <div>
      <div className=' w-full absolute -z-10'>
        <img className='w-full h-96 object-cover' src={background} alt='' />
      </div>
      <section>
        <article>
          <h1 className='text-2xl text-center lg:text-3xl text-white font-bold mb-8'> IP Addres Tracker</h1>
          <form autoComplete='off' onSubmit={handleSubmit} className='flex justify-center max-w-xl mx-auto'>
            <input
              type='text'
              name='ip-address'
              id='ip-address'
              placeholder="search for any IP Address or domain"
              required
              className='py-3 px-4 w-3/4 rounded-l-lg xl:w-full text-slate-900 font-bold'
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button type="submit" className='bg-black px-4 py-4 hover:opacity-60 rounded-r-lg'>
              <img src={arrow} alt='arrow' />
            </button>
          </form>
        </article>

        {
          address && <>
            <article className='bg-white rounded-lg shadow p-8 mt-8 mx-8
                      grid grid-cols-1 gap-2 lg:gap-8 md:grid-cols-2
                      lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left lg:-mb-16 relative ' style={{ zIndex: 1000 }}>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-400 tracking-wider mb-3'>Ip Address</h2>
                <p className='font-bold text-slate-900 text-xl md:text-xl xl:text-2xl'>{address.ip}</p>
              </div>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-400 tracking-wider mb-3'>location</h2>
                <p className='font-bold text-slate-900 text-xl md:text-xl xl:text-2xl'>{address.location.city}, {address.location.region}</p>
              </div>
              <div className='lg:border-r lg:border-slate-400'>
                <h2 className='uppercase text-sm font-bold text-slate-400 tracking-wider mb-3'>TIMEZONE</h2>
                <p className='font-bold text-slate-900 text-xl md:text-xl xl:text-2xl'>UTC {address.location.timezone}</p>
              </div>
              <div className=''>
                <h2 className='uppercase text-sm font-bold text-slate-400 tracking-wider mb-3'>ISP</h2>
                <p className='font-bold text-slate-900 text-xl  md:text-xl xl:text-2xl'>{address.isp}</p>
              </div>
            </article>
            <MapContainer className='mobile' style={{ height: '700px', width: '100vw' }} center={[address.location.lat, address.location.lng]} zoom={13} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MakerPosition address={address} />
            </MapContainer>
          </>
        }

      </section>
    </div>
  );
}

export default App;
