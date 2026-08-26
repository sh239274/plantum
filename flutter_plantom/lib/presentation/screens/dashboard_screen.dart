import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/jalali_engine.dart';
import '../../models/task_model.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedTabIndex = 0;

  final List<TaskModel> _tasks = [
    const TaskModel(
      id: 't-1',
      title: 'طراحی ساختار دیتابیس لوکال SQLite ویندوز',
      priority: TaskPriority.urgent,
      dueDate: 'امروز',
      isCompleted: true,
    ),
    const TaskModel(
      id: 't-2',
      title: 'پیاده‌سازی گاه‌شماری جلالی شمسی و تبدیل تاریخ',
      priority: TaskPriority.high,
      dueDate: 'امروز',
      isCompleted: true,
    ),
    const TaskModel(
      id: 't-3',
      title: 'بهینه‌سازی رابط کاربری نسخه دسکتاپ ویندوز Plantom',
      priority: TaskPriority.medium,
      dueDate: 'امروز',
      isCompleted: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final jalaliDateStr = JalaliEngine.formatJalali(now);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(LucideIcons.sparkles, color: Color(0xFF6366F1), size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'پلنتوم (Plantom)',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
            const Spacer(),
            Text(
              jalaliDateStr,
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey.shade400,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
      body: Row(
        children: [
          // Windows Sidebar
          NavigationRail(
            selectedIndex: _selectedTabIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedTabIndex = index;
              });
            },
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(LucideIcons.layoutDashboard),
                label: Text('داشبورد'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.checkSquare),
                label: Text('وظایف'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.flame),
                label: Text('عادت‌ها'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.timer),
                label: Text('تمرکز'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.calendar),
                label: Text('تقویم'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),

          // Main View Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4F46E5), Color(0xFF312E81)],
                        begin: Alignment.topRight,
                        end: Alignment.bottomLeft,
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'سامانه مدیریت بهره‌وری فردی پلنتوم (Plantom)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'نگارش رسمی ویندوز با معماری آفلاین SQLite و پشتیبانی دو زبانه',
                          style: TextStyle(
                            color: Colors.indigo.shade100,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                  const Text(
                    'وظایف روزانه',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  // Task List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _tasks.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final task = _tasks[index];
                      return Card(
                        child: ListTile(
                          leading: Checkbox(
                            value: task.isCompleted,
                            onChanged: (val) {
                              setState(() {
                                _tasks[index] = task.copyWith(isCompleted: val ?? false);
                              });
                            },
                          ),
                          title: Text(
                            task.title,
                            style: TextStyle(
                              decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                              color: task.isCompleted ? Colors.grey : null,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6366F1).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              task.dueDate ?? '',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF818CF8)),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
