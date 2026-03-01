/**
 * Security utilities for KNEX project.
 */

/**
 * Validates if a redirect path is safe (local and not an absolute external URL).
 * Prevents Open Redirect vulnerabilities.
 *
 * @param path The redirect path to validate
 * @returns true if the path is safe, false otherwise
 */
export const isValidRedirect = (path: string | null): boolean => {
    if (!path) return false;

    // Check if path is an absolute URL (starts with http:// or https:// or //)
    // This regex matches "http://", "https://", and "//" (protocol-relative)
    const isAbsoluteUrl = /^(?:[a-z+]+:)?\/\//i.test(path);

    // We only allow relative paths that start with '/'
    // This ensures they stay within the application domain
    const isLocalPath = path.startsWith('/');

    // Also block data URIs or javascript: URIs as a precaution
    const isMaliciousSchemes = /^(?:javascript|data|vbscript):/i.test(path);

    return !isAbsoluteUrl && isLocalPath && !isMaliciousSchemes;
};
