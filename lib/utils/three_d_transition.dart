import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ThreeDTransition extends CustomTransition {
  @override
  Widget buildTransition(
    BuildContext context,
    Curve? curve,
    Alignment? alignment,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return SlideTransition(
      position: Tween<Offset>(begin: const Offset(-1.0, 0.0), end: Offset.zero)
          .animate(
            CurvedAnimation(
              parent: animation,
              curve: curve ?? Curves.easeInOut,
            ),
          ),
      child: Transform(
        transform: Matrix4.identity()
          ..setEntry(3, 2, 0.001)
          ..rotateY(
            0.5 * (1.0 - animation.value),
          ), // Rotate other way for left entry
        alignment: Alignment.centerRight, // Pivot from right
        child: child,
      ),
    );
  }
}
