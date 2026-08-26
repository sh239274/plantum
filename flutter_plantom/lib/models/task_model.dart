enum TaskPriority { low, medium, high, urgent }
enum TaskStatus { todo, inProgress, completed, cancelled }

class TaskModel {
  final String id;
  final String title;
  final String? description;
  final TaskPriority priority;
  final TaskStatus status;
  final String? dueDate;
  final String? timeSlot;
  final String? projectId;
  final int estimatedMinutes;
  final bool isCompleted;

  const TaskModel({
    required this.id,
    required this.title,
    this.description,
    this.priority = TaskPriority.medium,
    this.status = TaskStatus.todo,
    this.dueDate,
    this.timeSlot,
    this.projectId,
    this.estimatedMinutes = 30,
    this.isCompleted = false,
  });

  TaskModel copyWith({
    String? id,
    String? title,
    String? description,
    TaskPriority? priority,
    TaskStatus? status,
    String? dueDate,
    String? timeSlot,
    String? projectId,
    int? estimatedMinutes,
    bool? isCompleted,
  }) {
    return TaskModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      dueDate: dueDate ?? this.dueDate,
      timeSlot: timeSlot ?? this.timeSlot,
      projectId: projectId ?? this.projectId,
      estimatedMinutes: estimatedMinutes ?? this.estimatedMinutes,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}
