const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100; // Security/performance — koi ?limit=99999 na bhej sake

// ---------------- Request se pagination params nikalna ----------------
export const getPaginationParams = (query = {}) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// ---------------- Response ka consistent shape banana ----------------
export const buildPaginationResult = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};