import * as z from 'zod/v4';

// === FILE OPERATIONS ===
export const ReadFileSchema = z.object({
  path: z.string().describe('Path to the file to read'),
  encoding: z.string().default('utf8').describe('File encoding'),
});

export const WriteFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  encoding: z.string().default('utf8'),
  createDirs: z.boolean().default(true),
});

export const CreateFileSchema = z.object({
  path: z.string(),
  content: z.string().default(''),
  overwrite: z.boolean().default(false),
  createDirs: z.boolean().default(true),
});

export const EditFileSchema = z.object({
  path: z.string(),
  method: z.enum(['replace', 'diff', 'line-numbers', 'character-match']),
  target: z.string().optional(),
  replacement: z.string().optional(),
  startLine: z.number().optional(),
  endLine: z.number().optional(),
  startChar: z.number().optional(),
  endChar: z.number().optional(),
  diffContent: z.string().optional(),
  diffFormat: z.enum(['unified', 'xml']).default('unified'),
});

export const DeleteFileSchema = z.object({
  path: z.string(),
});

export const CopyFileSchema = z.object({
  source: z.string(),
  destination: z.string(),
  overwrite: z.boolean().default(false),
});

export const MoveFileSchema = z.object({
  source: z.string(),
  destination: z.string(),
  overwrite: z.boolean().default(false),
});

export const ListDirectorySchema = z.object({
  path: z.string().default('.'),
  recursive: z.boolean().default(false),
  includeHidden: z.boolean().default(false),
  pattern: z.string().optional(),
});

export const CreateDirectorySchema = z.object({
  path: z.string(),
  recursive: z.boolean().default(true),
});

export const DeleteDirectorySchema = z.object({
  path: z.string(),
  recursive: z.boolean().default(false),
});

// === TERMINAL OPERATIONS ===
export const RunCommandSchema = z.object({
  command: z.string(),
  workingDirectory: z.string().default('.'),
  timeout: z.number().default(30000),
  shell: z.boolean().default(true),
  env: z.record(z.string(), z.string()).optional(),
});

export const RunCommandStreamSchema = z.object({
  command: z.string(),
  workingDirectory: z.string().default('.'),
  timeout: z.number().default(60000),
});

export const GetEnvironmentSchema = z.object({
  filter: z.string().optional(),
});

export const GetWorkingDirectorySchema = z.object({});

export const WhichCommandSchema = z.object({
  command: z.string(),
});

// === SEARCH OPERATIONS ===
export const SearchTextSchema = z.object({
  pattern: z.string(),
  directory: z.string().default('.'),
  filePattern: z.string().default('*'),
  excludePattern: z.string().optional(),
  recursive: z.boolean().default(true),
  caseSensitive: z.boolean().default(false),
  wholeWord: z.boolean().default(false),
  maxResults: z.number().default(100),
  contextLines: z.number().default(2),
});

export const SearchFilesSchema = z.object({
  pattern: z.string(),
  directory: z.string().default('.'),
  recursive: z.boolean().default(true),
  includeHidden: z.boolean().default(false),
  type: z.enum(['file', 'directory', 'both']).default('both'),
  maxResults: z.number().default(100),
});

export const FindAndReplaceSchema = z.object({
  findPattern: z.string(),
  replaceWith: z.string(),
  directory: z.string().default('.'),
  filePattern: z.string().default('*'),
  excludePattern: z.string().optional(),
  recursive: z.boolean().default(true),
  caseSensitive: z.boolean().default(false),
  dryRun: z.boolean().default(true),
  maxFiles: z.number().default(50),
});

export const SearchDuplicatesSchema = z.object({
  directory: z.string().default('.'),
  method: z.enum(['content', 'name', 'size']).default('content'),
  recursive: z.boolean().default(true),
  minSize: z.number().default(0),
  filePattern: z.string().default('*'),
});

// === UTILITY OPERATIONS ===
export const DelaySchema = z.object({
  milliseconds: z.number().optional(),
  seconds: z.number().optional(),
});

export const GetSystemInfoSchema = z.object({
  detailed: z.boolean().default(false),
});

export const GenerateUuidSchema = z.object({
  version: z.union([z.literal(1), z.literal(4)]).default(4),
  count: z.number().min(1).max(100).default(1),
});

export const EncodeDecodeSchema = z.object({
  text: z.string(),
  method: z.enum(['base64-encode', 'base64-decode', 'url-encode', 'url-decode', 'html-encode', 'html-decode']),
});

export const HashTextSchema = z.object({
  text: z.string(),
  algorithm: z.enum(['md5', 'sha1', 'sha256', 'sha512']).default('sha256'),
  encoding: z.enum(['hex', 'base64']).default('hex'),
});

export const FormatJsonSchema = z.object({
  json: z.string(),
  indent: z.number().default(2),
  sortKeys: z.boolean().default(false),
});

export const ValidateRegexSchema = z.object({
  pattern: z.string(),
  testString: z.string().optional(),
  flags: z.string().default(''),
});

export const CalculateFileStatsSchema = z.object({
  directory: z.string().default('.'),
  recursive: z.boolean().default(true),
  filePattern: z.string().default('*'),
});

// === MAPPING tool name → schema ===
export const TOOL_SCHEMAS: Record<string, z.ZodTypeAny> = {
  read_file: ReadFileSchema,
  write_file: WriteFileSchema,
  create_file: CreateFileSchema,
  edit_file: EditFileSchema,
  delete_file: DeleteFileSchema,
  copy_file: CopyFileSchema,
  move_file: MoveFileSchema,
  list_directory: ListDirectorySchema,
  create_directory: CreateDirectorySchema,
  delete_directory: DeleteDirectorySchema,
  run_command: RunCommandSchema,
  run_command_stream: RunCommandStreamSchema,
  get_environment: GetEnvironmentSchema,
  get_working_directory: GetWorkingDirectorySchema,
  which_command: WhichCommandSchema,
  search_text: SearchTextSchema,
  search_files: SearchFilesSchema,
  find_and_replace: FindAndReplaceSchema,
  search_duplicates: SearchDuplicatesSchema,
  delay: DelaySchema,
  get_system_info: GetSystemInfoSchema,
  generate_uuid: GenerateUuidSchema,
  encode_decode: EncodeDecodeSchema,
  hash_text: HashTextSchema,
  format_json: FormatJsonSchema,
  validate_regex: ValidateRegexSchema,
  calculate_file_stats: CalculateFileStatsSchema,
};