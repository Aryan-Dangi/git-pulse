export const SkeletonLine = ({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) => (
  <div className={`skeleton ${w} ${h}`} />
)

export const ProfileCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start gap-5">
      <div className="skeleton w-24 h-24 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <SkeletonLine w="w-40" h="h-6" />
        <SkeletonLine w="w-24" h="h-4" />
        <SkeletonLine w="w-full" h="h-4" />
        <SkeletonLine w="w-3/4" h="h-4" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4 mt-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton h-16 rounded-xl" />
      ))}
    </div>
  </div>
)

export const RepoCardSkeleton = () => (
  <div className="card animate-pulse space-y-3">
    <SkeletonLine w="w-48" h="h-5" />
    <SkeletonLine w="w-full" h="h-4" />
    <SkeletonLine w="w-3/4" h="h-4" />
    <div className="flex gap-4 pt-2">
      <SkeletonLine w="w-16" h="h-4" />
      <SkeletonLine w="w-16" h="h-4" />
      <SkeletonLine w="w-20" h="h-4" />
    </div>
  </div>
)

export const ChartSkeleton = () => (
  <div className="card animate-pulse">
    <SkeletonLine w="w-40" h="h-6" />
    <div className="skeleton w-full h-64 rounded-xl mt-4" />
  </div>
)

export const StatCardSkeleton = () => (
  <div className="card animate-pulse space-y-2">
    <SkeletonLine w="w-24" h="h-4" />
    <SkeletonLine w="w-16" h="h-8" />
  </div>
)
