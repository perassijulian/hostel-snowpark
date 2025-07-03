interface NoAvailabilityMessageProps {
  type: string;
  checkIn: string;
  checkOut: string;
}

export default function NoAvailabilityMessage({
  type,
  checkIn,
  checkOut,
}: NoAvailabilityMessageProps) {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
      <div className="text-sm text-yellow-800">
        <p className="font-medium mb-1">No availability</p>
        <p>
          Sorry, we don't have any <span className="font-semibold">{type}</span>{" "}
          available from <span className="font-semibold">{checkIn}</span> to{" "}
          <span className="font-semibold">{checkOut}</span>. Try adjusting your
          dates or accommodation type.
        </p>
      </div>
    </div>
  );
}
