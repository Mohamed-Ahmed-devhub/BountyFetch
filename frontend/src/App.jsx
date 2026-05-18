// ===== المكوّن الجذري للتطبيق =====
// يحتوي على: نظام التوجيه (Routing) + السياق العام للتطبيق

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// الصفحات - سيتم ملؤها تدريجياً
import LandingPage   from './pages/LandingPage.jsx'
import Dashboard     from './pages/Dashboard.jsx'
import ProfileSetup  from './pages/ProfileSetup.jsx'
import TaskDetail    from './pages/TaskDetail.jsx'
import CodeShield    from './pages/CodeShield.jsx'
import Login         from './pages/Auth/Login.jsx'
import Register      from './pages/Auth/Register.jsx'

function App() {
  return (
    // Router: يتحكم في عناوين URL داخل التطبيق
    <Router>
      <Routes>
        {/* الصفحة الرئيسية - Landing Page */}
        <Route path="/"              element={<LandingPage />} />
        
        {/* لوحة التحكم الرئيسية - الرادار */}
        <Route path="/dashboard"     element={<Dashboard />} />
        
        {/* إعداد ملف المستخدم والمهارات */}
        <Route path="/profile-setup" element={<ProfileSetup />} />
        
        {/* تفاصيل المهمة + مولد البروبوزال */}
        <Route path="/task/:id"      element={<TaskDetail />} />
        
        {/* درع المساعدة البرمجي - الشات بوت */}
        <Route path="/code-shield"   element={<CodeShield />} />
        
        {/* صفحات المصادقة */}
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
