import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validation";
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from "../validators/task.validator";
import { UserRole } from "../constants/index";

const router = Router();
const controller = new TaskController();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task (Admin or Super Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Set up CI/CD pipeline
 *               description:
 *                 type: string
 *                 example: Setup GitHub actions pipeline for automated builds and tests.
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *                 example: Pending
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-30T12:00:00.000Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(createTaskSchema),
  controller.createTask
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (with pagination, filters, sorting, search)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting string (e.g. -createdAt or dueDate)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in title/description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter by priority
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *         description: Filter by exact date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, validate(taskQuerySchema, "query"), controller.getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get("/:id", authenticate, controller.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task (Admin or Super Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate(updateTaskSchema),
  controller.updateTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Soft delete a task (Admin or Super Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  controller.deleteTask
);

export const taskRoutes = router;
