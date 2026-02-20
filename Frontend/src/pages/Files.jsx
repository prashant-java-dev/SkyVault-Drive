
import React, { useState, useEffect, useMemo } from 'react';
import {
    File,
    Trash2,
    Share2,
    Download,
    FileText,
    Image as ImageIcon,
    Plus,
    Upload,
    X,
    MoreVertical,
    List,
    ChevronRight,
    Search,
    LayoutGrid,
    Info,
    Check,
    Save,
    History,
    Eye,
    Maximize2,
    FileCode,
    FileBox,
    Calendar,
    Filter,
    Star,
    RefreshCw,
    Trash,
    ExternalLink,
    Archive,
    Loader2
} from 'lucide-react';
import JSZip from 'jszip';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const Files = ({ filterMode = 'all' }) => {
    const { authState } = useAuth();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Selection & Details State
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Metadata Editing
    const [editDesc, setEditDesc] = useState('');
    const [editTags, setEditTags] = useState([]);
    const [isSavingMetadata, setIsSavingMetadata] = useState(false);

    useEffect(() => {
        loadFiles();
        setSelectedIds([]);
        setActiveFile(null);
    }, [filterMode]);

    useEffect(() => {
        if (activeFile) {
            setEditDesc(activeFile.description || '');
            setEditTags(activeFile.tags || []);
        }
    }, [activeFile]);

    const loadFiles = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getFiles();
            // Assuming backend returns matching structure. 
            // If not, we might need to map fields here.
            // But we proactively updated Backend Model!
            setFiles(data);
        } catch (e) {
            console.error("Failed to load files", e);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredFiles = useMemo(() => {
        let result = files.filter(file => {
            if (filterMode === 'trash') {
                if (!file.isDeleted) return false;
            } else {
                if (file.isDeleted) return false;
                if (filterMode === 'starred' && !file.isStarred) return false;
            }
            const matchesSearch = file.originalName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === 'all' ||
                (typeFilter === 'image' && file.mimetype?.startsWith('image')) ||
                (typeFilter === 'pdf' && file.mimetype === 'application/pdf') ||
                (typeFilter === 'doc' && file.mimetype?.includes('word'));
            return matchesSearch && matchesType;
        });

        result.sort((a, b) => {
            if (sortBy === 'newest' || filterMode === 'recent') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            if (sortBy === 'oldest') return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
            if (sortBy === 'name') return a.originalName?.localeCompare(b.originalName);
            if (sortBy === 'size') return b.size - a.size;
            return 0;
        });

        return result;
    }, [files, searchQuery, typeFilter, sortBy, filterMode]);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(0);
        try {
            await apiService.uploadFile(file, (p) => setUploadProgress(p));
        } catch (e) {
            console.error("Upload failed", e);
            alert("Upload failed!");
        }
        setIsUploading(false);
        setShowUploadModal(false);
        loadFiles();
    };

    const toggleSelect = (id, e) => {
        e.stopPropagation();
        setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
    };

    const handleFileClick = (file) => {
        setActiveFile(file);
        setIsDetailsOpen(true);
        if (selectedIds.length <= 1) setSelectedIds([file.id]);
    };

    const handleToggleStar = async (id, e) => {
        e.stopPropagation();
        await apiService.toggleStar(id);
        loadFiles();
    };

    const handleBulkDownload = async () => {
        if (selectedIds.length === 0) return;
        setIsProcessingBulk(true);

        try {
            const selectedFiles = files.filter(f => selectedIds.includes(f.id));

            if (selectedFiles.length === 1) {
                // Real download implementation would point to backend URL
                // window.open(`/api/files/download/${selectedFiles[0].id}`);
                alert(`Starting download for: ${selectedFiles[0].originalName}`);
            } else {
                const zip = new JSZip();
                selectedFiles.forEach(file => {
                    zip.file(file.originalName, `SkyVault File Content Placeholder\nName: ${file.originalName}\nSize: ${file.size} bytes`);
                });

                const content = await zip.generateAsync({ type: 'blob' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `SkyVault_Selection_${new Date().getTime()}.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Bulk download failed", error);
        } finally {
            setIsProcessingBulk(false);
        }
    };

    const handleBulkShare = async () => {
        if (selectedIds.length === 0) return;
        setIsProcessingBulk(true);

        try {
            for (const id of selectedIds) {
                const file = files.find(f => f.id === id);
                if (file && !file.isPublic) {
                    await apiService.updateMetadata(id, { isPublic: true });
                }
            }
            alert(`${selectedIds.length} files are now public and ready for sharing.`);
            loadFiles();
        } catch (error) {
            console.error("Bulk share failed", error);
        } finally {
            setIsProcessingBulk(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) return;
        if (action === 'delete') {
            if (!confirm(`Permanently delete ${selectedIds.length} files?`)) return;
            await apiService.deleteFiles(selectedIds);
        } else if (action === 'trash') {
            await apiService.moveToTrash(selectedIds);
        }
        setSelectedIds([]);
        setActiveFile(null);
        loadFiles();
    };

    const handleSaveMetadata = async () => {
        if (!activeFile) return;
        setIsSavingMetadata(true);
        await apiService.updateMetadata(activeFile.id, { description: editDesc, tags: editTags });
        setIsSavingMetadata(false);
        loadFiles();
    };

    const getFileIcon = (type, size = 20) => {
        if (type?.startsWith('image')) return <ImageIcon className="text-red-500" size={size} />;
        if (type === 'application/pdf') return <FileText className="text-orange-500" size={size} />;
        return <FileCode className="text-primary" size={size} />;
    };

    const renderFileList = (items) => {
        if (viewMode === 'list') {
            return (
                <div className="rounded-[2.5rem] border border-[#dadce0] dark:border-[#202124] overflow-hidden bg-white dark:bg-[#131314] shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[1px] text-slate-400 border-b border-[#dadce0] dark:border-white/5">
                            <tr>
                                <th className="px-6 py-5 w-12 text-center">Select</th>
                                <th className="px-6 py-5">File Name</th>
                                <th className="px-6 py-5">Modified</th>
                                <th className="px-6 py-5">Size</th>
                                <th className="px-6 py-5 w-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {items.map((file) => (
                                <tr
                                    key={file.id}
                                    onClick={() => handleFileClick(file)}
                                    className={`group hover:bg-[#f8f9fa] dark:hover:bg-white/5 cursor-pointer transition-all ${selectedIds.includes(file.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                >
                                    <td className="px-6 py-5 text-center">
                                        <div
                                            onClick={(e) => toggleSelect(file.id, e)}
                                            className={`w-6 h-6 mx-auto rounded-lg border-2 flex items-center justify-center transition-all ${selectedIds.includes(file.id) ? 'bg-primary border-primary' : 'border-[#dadce0] dark:border-white/10'}`}
                                        >
                                            {selectedIds.includes(file.id) && <Check size={14} className="text-white" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{getFileIcon(file.mimetype, 24)}</div>
                                            <span className="text-sm font-bold truncate max-w-[250px]">{file.originalName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-slate-400">{new Date(file.uploadDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={(e) => handleToggleStar(file.id, e)} className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-full transition-colors">
                                                <Star size={16} className={file.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-all"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {items.map((file) => (
                    <div
                        key={file.id}
                        onClick={() => handleFileClick(file)}
                        onDoubleClick={() => setPreviewFile(file)}
                        className={`group p-6 rounded-[2.5rem] border transition-all cursor-pointer relative ${selectedIds.includes(file.id) ? 'bg-primary/5 dark:bg-primary/10 border-primary ring-4 ring-primary/5 scale-[1.02]' : 'bg-white dark:bg-[#131314] border-[#dadce0] dark:border-[#202124] hover:shadow-2xl hover:border-primary/30'}`}
                    >
                        <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
                            <div
                                onClick={(e) => toggleSelect(file.id, e)}
                                className={`w-6 h-6 rounded-lg border-2 transition-all ${selectedIds.includes(file.id) ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'border-[#dadce0] opacity-0 group-hover:opacity-100'}`}
                            >
                                {selectedIds.includes(file.id) && <Check size={14} className="text-white mx-auto mt-0.5" />}
                            </div>
                        </div>
                        <button onClick={(e) => handleToggleStar(file.id, e)} className={`absolute top-5 right-5 p-1 transition-all z-10 ${file.isStarred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <Star size={18} className={file.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                        </button>
                        <div className="aspect-square bg-slate-50 dark:bg-[#1a1a1c] rounded-3xl mb-5 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors shadow-inner">
                            <div className="w-full h-full transform transition-transform group-hover:scale-110 duration-700 ease-out flex items-center justify-center">
                                {getFileIcon(file.mimetype, 40)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-black truncate text-[#3c4043] dark:text-white">{file.originalName}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[1px]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex h-full relative overflow-hidden bg-white dark:bg-[#0a0a0b]">
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isDetailsOpen ? 'mr-80' : ''}`}>

                {selectedIds.length > 0 && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1f1f21] px-6 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-primary/30 flex items-center gap-6 z-50 animate-in slide-in-from-top-10">
                        <div className="flex items-center gap-3 pr-4 border-r border-[#dadce0] dark:border-white/10">
                            <button onClick={() => setSelectedIds([])} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all"><X size={18} /></button>
                            <span className="text-sm font-black text-primary uppercase tracking-tighter">{selectedIds.length} Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isProcessingBulk ? (
                                <div className="px-4 py-2 flex items-center gap-2 text-primary">
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Processing...</span>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setPreviewFile(files.find(f => f.id === selectedIds[0]) || null)} className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-all" title="Preview first selection"><Eye size={18} /></button>
                                    <button onClick={handleBulkDownload} className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-all" title="Download selected (ZIP)"><Download size={18} /></button>
                                    <button onClick={handleBulkShare} className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-all" title="Make selected public"><Share2 size={18} /></button>
                                    <button onClick={() => handleBulkAction(filterMode === 'trash' ? 'delete' : 'trash')} className="p-2.5 hover:bg-red-50 rounded-xl text-red-400 transition-all" title="Move to trash">
                                        {filterMode === 'trash' ? <Trash2 size={18} /> : <Trash size={18} />}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Header Bar */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-[#dadce0] dark:border-[#202124] backdrop-blur-xl bg-white/50 dark:bg-black/20 z-10">
                    <div className="flex items-center gap-6 flex-1 max-w-5xl">
                        <h2 className="text-2xl font-black tracking-tighter capitalize hidden sm:block">{filterMode === 'all' ? 'My Drive' : filterMode}</h2>
                        <div className="flex-1 relative group max-w-md">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-primary/20 focus:bg-white rounded-2xl text-sm font-medium outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                        <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-3 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] rounded-2xl text-secondary transition-all">
                            {viewMode === 'grid' ? <List size={20} /> : <LayoutGrid size={20} />}
                        </button>
                        <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className={`p-3 rounded-2xl transition-all ${isDetailsOpen ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-[#f1f3f4]'}`}>
                            <Info size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                            <RefreshCw size={48} className="animate-spin mb-4 text-primary" />
                            <p className="font-black uppercase tracking-[1px] text-xs">Loading Files...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <FileBox size={100} strokeWidth={1} className="mb-6" />
                            <p className="font-black uppercase tracking-[2px] text-xs text-center">No files found</p>
                        </div>
                    ) : (
                        renderFileList(filteredFiles)
                    )}
                </div>
            </div>

            <aside className={`fixed top-16 right-0 h-[calc(100%-64px)] w-80 bg-white dark:bg-[#131314] border-l border-[#dadce0] dark:border-[#202124] transition-transform duration-500 transform shadow-2xl z-40 overflow-y-auto ${isDetailsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {activeFile ? (
                    <div className="flex flex-col h-full">
                        <div className="p-8 border-b border-[#dadce0] dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#131314]/90 backdrop-blur-xl z-10">
                            <h2 className="font-black text-[10px] uppercase tracking-[2px] text-primary flex items-center gap-2"><Info size={16} /> File Details</h2>
                            <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all"><X size={18} /></button>
                        </div>
                        <div className="p-8 space-y-10">
                            <div className="aspect-video bg-slate-50 dark:bg-[#1a1a1c] rounded-[2rem] border-2 border-dashed border-[#dadce0] dark:border-white/10 flex flex-col items-center justify-center relative group overflow-hidden shadow-inner">
                                {getFileIcon(activeFile.mimetype, 50)}
                                <button onClick={() => setPreviewFile(activeFile)} className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Maximize2 size={24} className="text-primary" />
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-[#dadce0] dark:border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-[1px] text-slate-400 block mb-3">Description</label>
                                    <textarea
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="Add a note about this file..."
                                        className="w-full h-28 bg-transparent border-none text-sm font-medium outline-none resize-none placeholder:opacity-30 scrollbar-hide text-slate-800 dark:text-slate-200"
                                    />
                                </div>
                                <button onClick={handleSaveMetadata} disabled={isSavingMetadata} className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[2px] rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all">
                                    <Save size={16} className="inline mr-2" /> {isSavingMetadata ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-30">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[3rem] flex items-center justify-center"><Info size={40} /></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Select a file to see details</p>
                    </div>
                )}
            </aside>

            {/* Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-10 animate-in fade-in duration-500">
                    <button onClick={() => setPreviewFile(null)} className="absolute top-10 right-10 text-white/40 hover:text-white hover:rotate-90 transition-all p-2"><X size={48} /></button>
                    <div className="w-full max-w-6xl flex flex-col items-center gap-14">
                        <div className="w-full aspect-video bg-[#0d0d0e] rounded-[4rem] border border-white/10 shadow-2xl flex items-center justify-center p-10 overflow-hidden relative">
                            {getFileIcon(previewFile.mimetype, 120)}
                        </div>
                        <div className="text-center">
                            <p className="text-white text-4xl font-black tracking-tighter">{previewFile.originalName}</p>
                            <button className="mt-8 px-14 py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[2px] text-[11px] shadow-2xl shadow-primary/40 flex items-center gap-4 hover:scale-110 active:scale-95 transition-all">
                                <Download size={22} /> DOWNLOAD FILE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal Trigger */}
            <button onClick={() => setShowUploadModal(true)} className="fixed bottom-12 right-12 w-20 h-20 bg-primary text-white rounded-[2.5rem] shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-90 transition-all group border-4 border-white dark:border-[#131314]">
                <Plus size={44} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setShowUploadModal(false)}></div>
                    <div className="bg-white dark:bg-[#1f1f21] w-full max-w-2xl rounded-[4rem] p-16 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-[#dadce0] dark:border-white/10">
                        <button onClick={() => setShowUploadModal(false)} className="absolute right-12 top-12 text-slate-400 hover:text-primary transition-all p-3"><X size={32} /></button>
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">Upload File</h2>
                        <label className="group relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-[#dadce0] dark:border-white/5 hover:border-primary rounded-[3.5rem] cursor-pointer bg-slate-50 dark:bg-white/5 transition-all overflow-hidden">
                            <Upload className="text-primary mb-8" size={52} />
                            <p className="text-2xl font-black tracking-tight">Select File to Upload</p>
                            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            {isUploading && (
                                <div className="absolute inset-0 bg-white/98 dark:bg-[#1f1f21]/98 flex flex-col items-center justify-center p-16 z-20 backdrop-blur-md">
                                    <div className="w-full h-5 bg-primary/10 rounded-full mb-10 overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <span className="text-4xl font-black text-primary">{uploadProgress}% UPLOADED</span>
                                </div>
                            )}
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Files;
