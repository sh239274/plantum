package com.example.plantom.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.plantom.utils.TranslationStrings

@Composable
fun FlutterCodeScreen(
    t: TranslationStrings
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    val flutterMainCode = """// Plantom Flutter Architecture Specification
// Converted to Native Kotlin & Jetpack Compose
import 'package:flutter/material.dart';

void main() {
  runApp(const PlantomApp());
}

class PlantomApp extends StatelessWidget {
  const PlantomApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Plantom Productivity',
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF6366F1),
        scaffoldBackgroundColor: const Color(0xFF090D16),
      ),
      home: const DashboardScreen(),
    );
  }
}
"""

    val jalaliEngineCode = """// Jalali Calendar Engine in Dart
class JalaliEngine {
  static JalaliDate gregorianToJalali(int gy, int gm, int gd) {
    final gDNo = [0, 31, (isLeapYear(gy) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var gy2 = (gm > 2) ? (gy + 1) : gy;
    var days = 355666 + (365 * gy) + ((gy2 + 3) ~/ 4) - ((gy2 + 99) ~/ 100) + ((gy2 + 399) ~/ 400) + gd;
    for (var i = 0; i < gm; ++i) days += gDNo[i];
    var jy = -1595 + (33 * (days ~/ 12053));
    days %= 12053;
    jy += 4 * (days ~/ 1461);
    days %= 1461;
    if (days > 365) {
      jy += (days - 1) ~/ 365;
      days = (days - 1) % 365;
    }
    final jm = (days < 186) ? 1 + (days ~/ 31) : 7 + ((days - 186) ~/ 30);
    final jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return JalaliDate(jy, jm, jd);
  }
}
"""

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 60.dp)
    ) {
        item {
            Text(
                text = t.navFlutterCode,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        item {
            CodeViewerCard(
                title = "main.dart",
                code = flutterMainCode,
                onCopy = {
                    clipboardManager.setText(AnnotatedString(flutterMainCode))
                    Toast.makeText(context, "کپی شد / Copied", Toast.LENGTH_SHORT).show()
                }
            )
        }

        item {
            CodeViewerCard(
                title = "jalali_engine.dart",
                code = jalaliEngineCode,
                onCopy = {
                    clipboardManager.setText(AnnotatedString(jalaliEngineCode))
                    Toast.makeText(context, "کپی شد / Copied", Toast.LENGTH_SHORT).show()
                }
            )
        }
    }
}

@Composable
private fun CodeViewerCard(
    title: String,
    code: String,
    onCopy: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                IconButton(onClick = onCopy) {
                    Icon(
                        Icons.Default.ContentCopy,
                        contentDescription = "Copy",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(0xFF0F172A),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                        .horizontalScroll(rememberScrollState())
                ) {
                    Text(
                        text = code,
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.sp,
                            color = Color(0xFF93C5FD)
                        )
                    )
                }
            }
        }
    }
}
