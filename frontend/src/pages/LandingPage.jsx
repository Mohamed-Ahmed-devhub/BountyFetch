// ===================================================
// LandingPage.jsx - الصفحة الرئيسية للزوار
// ===================================================
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'

const FEATURES = [
  { icon: '📡', key: 'feature_radar' },
  { icon: '✍️', key: 'feature_proposal' },
  { icon: '🛡️', key: 'feature_shield' },
]

function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Navbar />
      
      {/* قسم البطل (Hero Section) */}
      <section className="min-h-[85vh] flex items-center justify-center text-center px-4 relative overflow-hidden">
        {/* تأثير الضوء الخلفي */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-sm">
            <span className="live-dot"></span>
            الرادار يعمل الآن
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
            <span className="neon-text">{t('landing.hero_title')}</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            {t('landing.hero_subtitle')}
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button variant="primary" size="lg">
                🎯 {t('landing.cta_start')}
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              {t('landing.cta_learn')}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* قسم المميزات */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('landing.features_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card glow={i === 0} className="h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-brand-cyan mb-2">
                  {t(`landing.${feature.key}`)}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(`landing.${feature.key}_desc`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
