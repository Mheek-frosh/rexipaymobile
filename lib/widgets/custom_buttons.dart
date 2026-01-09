import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Primary filled button with customizable colors
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? backgroundColor;
  final Color? textColor;
  final double? width;
  final double? height;
  final double borderRadius;
  final EdgeInsets? padding;

  const PrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.backgroundColor = const Color(0xFF2E63F6),
    this.textColor = Colors.white,
    this.width,
    this.height,
    this.borderRadius = 12,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height ?? 56,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          padding: padding ?? const EdgeInsets.symmetric(vertical: 16),
          elevation: 0,
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: textColor,
          ),
        ),
      ),
    );
  }
}

/// Outlined button with customizable border and text colors
class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color borderColor;
  final Color textColor;
  final double? width;
  final double? height;
  final double borderRadius;
  final double borderWidth;
  final EdgeInsets? padding;

  const SecondaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.borderColor = const Color(0xFF2E63F6),
    this.textColor = const Color(0xFF2E63F6),
    this.width,
    this.height,
    this.borderRadius = 12,
    this.borderWidth = 1.5,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height ?? 56,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: borderColor, width: borderWidth),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          padding: padding ?? const EdgeInsets.symmetric(vertical: 16),
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: textColor,
          ),
        ),
      ),
    );
  }
}

/// Outlined button with icon
class IconOutlinedButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback onPressed;
  final Color borderColor;
  final Color textColor;
  final Color iconColor;
  final double borderRadius;
  final EdgeInsets? padding;

  const IconOutlinedButton({
    super.key,
    required this.text,
    required this.icon,
    required this.onPressed,
    this.borderColor = Colors.white,
    this.textColor = Colors.white,
    this.iconColor = Colors.white,
    this.borderRadius = 20,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: iconColor),
      label: Text(text, style: GoogleFonts.inter(color: textColor)),
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: borderColor),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        padding:
            padding ?? const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    );
  }
}
