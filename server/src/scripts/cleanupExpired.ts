import pool from '../db/pool';

/**
 * Delete URLs that have expired
 * Can be run as a cron job or scheduled task
 */
async function cleanupExpiredUrls() {
  try {
    const result = await pool.query(
      'DELETE FROM urls WHERE expires_at IS NOT NULL AND expires_at < NOW() RETURNING id, short_code, expires_at'
    );

    if (result.rows.length > 0) {
      console.log(`✓ Cleaned up ${result.rows.length} expired URL(s):`);
      result.rows.forEach((row) => {
        console.log(`  - ${row.short_code} (expired: ${row.expires_at})`);
      });
    } else {
      console.log('✓ No expired URLs to clean up');
    }

    return result.rows.length;
  } catch (err) {
    console.error('Error cleaning up expired URLs:', err);
    throw err;
  }
}

// Run if called directly
if (require.main === module) {
  cleanupExpiredUrls()
    .then((count) => {
      console.log(`\nCleanup complete. Removed ${count} expired URL(s).`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Cleanup failed:', err);
      process.exit(1);
    });
}

export default cleanupExpiredUrls;
