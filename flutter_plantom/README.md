# Plantom (پلنتوم) - Personal Productivity & Planning System

سامانه جامع و پیشرفته برنامه‌ریزی، مدیریت وظایف، عادات و تمرکز فردی با معماری فلاتر برای ویندوز، اندروید و وب.

## 🚀 راهنمای ساخت نسخه ویندوز (Build Plantom for Windows)

### نیازمندی‌ها (Prerequisites):
1. نصب **Flutter SDK** (نسخه ۳.۲۰ به بالا)
2. نصب **Visual Studio 2022** با بسته **Desktop development with C++**
3. فعال بودن حالت **Developer Mode** در تنظیمات ویندوز

### نحوه بیلد و اجرای خودکار:
فقط کافیست فایل `build_windows.bat` را دو بار کلیک کرده یا در ترمینال اجرا کنید:

```cmd
build_windows.bat
```

دستورات بیلد دستی:
```cmd
flutter clean
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter build windows --release
```

📁 فایل اجرایی نهایی `Plantom.exe` در مسیر زیر تولید خواهد شد:
`build\windows\x64\runner\Release\Plantom.exe`
