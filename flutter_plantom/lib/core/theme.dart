import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PlantomTheme {
  static const primaryColor = Color(0xFF6366F1);
  static const darkBackground = Color(0xFF0A0A0B);
  static const darkCard = Color(0xFF141416);
  static const darkBorder = Color(0xFF27272A);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        surface: darkCard,
        background: darkBackground,
      ),
      fontFamily: GoogleFonts.vazirmatn().fontFamily,
      cardTheme: CardTheme(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: darkBorder, width: 1),
        ),
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        surface: Colors.white,
      ),
      fontFamily: GoogleFonts.vazirmatn().fontFamily,
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
      ),
    );
  }
}
