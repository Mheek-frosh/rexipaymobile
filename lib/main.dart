import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:rexipaymobile/screens/home_screen.dart';


void main() {
  runApp(const RexiPayApp());
}

class RexiPayApp extends StatelessWidget {
  const RexiPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RexiPay',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2E63F6)),
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(),
      ),
      home: const HomeScreen(),
    );
  }
}
