const AttendanceBanner = () => {
  return (
    <div className="mt-6 bg-warning/20 border border-warning/30 rounded-xl p-4 text-center">
      <p className="text-warning font-medium">
        Mark Attendance <span className="text-muted-foreground">or if on leave</span>{" "}
        <span className="text-warning">You are currently on approved leave. Enjoy your break!</span>
      </p>
    </div>
  );
};

export default AttendanceBanner;
