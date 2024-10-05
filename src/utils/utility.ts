export const getErrorMessage = (data: any): string => {
    const errorMessages: Record<string, string[]> = {};
    // Organize errors by field
    data.error.issues.forEach((issue : any) => {
        const field = issue.path.join('.');
        if (!errorMessages[field]) {
            errorMessages[field] = [];
        }
        errorMessages[field].push(issue.message);
    });

    const formattedErrors = Object.entries(errorMessages)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join(' | ');
        
    return formattedErrors
}